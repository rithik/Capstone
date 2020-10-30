import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import { ChatFeed as ChatFeedUI, Message } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { gql, useMutation } from '@apollo/client';
import JSEncrypt from 'jsencrypt';
// import 'bootstrap/dist/css/bootstrap.min.css';


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const SEND_MESSAGE = gql`
    mutation SendMessage($username: String!, $content: String!, $gid: Int!){
        createMessage(sender:$username, group:$gid, content:$content){
            id
            content
            ts
        }
    }
`;


// https://stackoverflow.com/questions/57068850/how-to-split-a-string-into-chunks-of-a-particular-byte-size
function chunk(s, maxBytes) {
    let buf = Buffer.from(s);
    const result = [];
    while (buf.length) {
        let i = buf.lastIndexOf(32, maxBytes+1);
        // If no space found, try forward search
        if (i < 0) i = buf.indexOf(32, maxBytes);
        // If there's no space at all, take the whole string
        if (i < 0) i = buf.length;
        // This is a safe cut-off point; never half-way a multi-byte
        result.push(buf.slice(0, i).toString());
        buf = buf.slice(i+1); // Skip space (if any)
    }
    return result;
}

function encryptMessage(message, type){
    var message_to_encrypt_json = {"message": message, "type":type}
    var message_to_encrypt_string = JSON.stringify(message_to_encrypt_json);
    var chunks = chunk(message_to_encrypt_string, 500);
    console.log(chunks);
    var crypt = new JSEncrypt();
    var publicKey = "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAweyAiCo+w3Gxbdj72kPWYm36buUIbkTLHhnhni7nGcp53Rui8paKqr6VIRtJBKqwSOvNz2EqBkikGA5Knj4kQWlihqOJ3clTvk/Di+TnBAiNxUikxb4lOrLR15LZ1+1i1RCZXd1dTCqqvuddiPLMLbo8FG+ppvxBrlWQXNOY+8/7sQJuJpHdneweZuyD9KVeUJgHzBl3gseMaKGB21CUzeXYQYR49wbZem7+fKJEPnQqWZrdxui13YLTJ+FzFDUusSYTUgzBDHBUZwlBb4uo5cct5gyhFqO9Lk5RyNL3ei/+gIdQCDWW7TL91L1FM8ICqnWtTfHKwN1qz/1zUa6scEkJO8SPUY3qQaPJy3pYWYxD87ItW22RL+zCEA3Qy/XwgTHxBV+rET5V8cTDzLlF9WiDSYbW60YtxahDiedMTkmB3CwJVc8oidGLtAxIGWBIzes9HTRjLtNlVBM8D5uSRbz515LLRnEp98RSt7S2L0EjNhD4NsWYL7vHNQPeYaIiDUdMKox8hX9q360S+uE3shksETwwrshZdcafagRUZmTfipuetlTWrOlolbGwajA2iUq4VeMEzJNOI0A8Oe2oLEZZNtNVDvXrL8LNsLXj5cIdRoEMOm0JD892SrdU/Jx6tJQNrZ+agpkn9wppdKvqAqrmIBEl3bnLCmwXOAA8PU0CAwEAAQ==-----END PUBLIC KEY-----";
    crypt.setPublicKey(publicKey);
    var enc_text = "";
    for(var i = 0; i < chunks.length; i++){
        enc_text += crypt.encrypt(chunks[i]);
    }
    return enc_text
}

function decryptMessage(message){
    var crypt2 = new JSEncrypt();
    var privateKey = localStorage.get('user-privateKey');
    crypt2.setPrivateKey(privateKey);
    var dec_message = crypt2.decrypt(message);
    var dec_message_json = JSON.parse(dec_message);
    return [dec_message_json["message"], dec_message_json["type"]]
}


function ChatFeed({
    entries,
    onLoadMore,
    doneFetching,
    subscribeToNewMessages,
    selectedGroup
}) {
    const [firstLoad, setFirstLoad] = useState(true);
    const [messageInput, setMessageInput] = useState("");
    const [createMessage] = useMutation(SEND_MESSAGE);
    let messagesEndRef = React.createRef();
    let messagesStartRef = React.createRef();

    window.lm = onLoadMore;
    const reversedEntries = [].concat(entries.messagesByGroup).reverse();
    const username = localStorage.getItem('username');
    const messages = reversedEntries.map(message => {
        return new Message({ id: message.sender === username ? 0 : message.sender, message: message.content, senderName: `@${message.sender}` })
    })
    useEffect(() => {
        if (firstLoad) {
            messagesEndRef.scrollIntoView({ behavior: "smooth" });
            subscribeToNewMessages();
            setFirstLoad(false);
        }
        setInterval(() => {
            const offset = 0;
            if (!messagesStartRef) return false;
            const top = messagesStartRef.getBoundingClientRect().top;
            const inView = (top + offset) >= 0 && (top - offset) <= window.innerHeight;
            if (inView && !doneFetching) {
                onLoadMore();
            }
        }, 1000);
    }, [firstLoad, setFirstLoad, onLoadMore, messagesStartRef, messagesEndRef]);
    console.log(entries);
    return <div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '50px' }}>
        <div style={{ height: '30px' }}
            ref={(el) => { messagesStartRef = el; }}>
            {
                !doneFetching && <ClipLoader
                    css={override}
                    size={30}
                    color={"#123abc"}
                    loading={true}
                />
            }
        </div>
        <ChatFeedUI
            messages={messages}
            showSenderName
            bubblesCentered={false}
            bubbleStyles={
                {
                    text: {
                        fontSize: 14
                    },
                    chatbubble: {
                        borderRadius: 30,
                        padding: 15
                    }
                }
            }
        />
        <div style={{ float: "left", clear: "both" }}
            ref={(el) => { messagesEndRef = el; }}>
        </div>
        <Form style={{ width: "75vw", bottom: "20px", position: "fixed" }}>
            <Form.Group>
                <Form.Control type="text" placeholder="Enter message" value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyPress={event => {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    createMessage({ variables: { username: "user4", gid: selectedGroup, content: encryptMessage(messageInput, "text") } });
                }
              }}/>
            </Form.Group>
        </Form>
    </div>;
}

export default ChatFeed;