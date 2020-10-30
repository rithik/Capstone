import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import { ChatFeed as ChatFeedUI, Message } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { gql, useMutation } from '@apollo/client';
import JSEncrypt from 'jsencrypt';
import CryptoJS from "crypto-js";
import 'bootstrap/dist/css/bootstrap.min.css';


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

function encryptMessage(message, type){
    var messageJSON = {"message": message, "type":type}
    var messageString = JSON.stringify(messageJSON);
    const groupPrivateKey = localStorage.getItem('user-privateKey');
    const encrypted = CryptoJS.AES.encrypt(messageString, groupPrivateKey).toString();
    return encrypted;
}

function decryptMessage(message){
    const groupPrivateKey = localStorage.getItem('user-privateKey');
    const decrypt = CryptoJS.AES.decrypt(message, groupPrivateKey);
    return decrypt.toString(CryptoJS.enc.Utf8);
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
        return new Message({ id: message.sender === username ? 0 : message.sender, message: decryptMessage(message.content), senderName: `@${message.sender}` })
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