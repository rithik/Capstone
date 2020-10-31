import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import { ChatFeed as ChatFeedUI, Message } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { gql, useMutation } from '@apollo/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {encryptMessage, decryptMessage, decryptMessageForPrivateKey} from '../utils/AESEncryption';


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const SEND_MESSAGE = gql`
    mutation SendMessage($username: String!, $content: String!, $gid: Int!, $cType: String!){
        createMessage(sender:$username, group:$gid, content:$content, cType:$cType){
            id
            content
            ts
        }
    }
`;

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
        if (message.cType.includes("group-private-key")){
            if (message.cType.includes(username)){
                if (localStorage.getItem(`${selectedGroup}-privateKey`) == null || localStorage.getItem(`${selectedGroup}-privateKey`) === "undefined"){
                    const messageContent = decryptMessageForPrivateKey(message.content);
                    localStorage.setItem(`${selectedGroup}-privateKey`, messageContent);
                }
            }
            return null;
        }
        return new Message({ id: message.sender === username ? 0 : message.sender, message: decryptMessage(message.content, selectedGroup).message, senderName: `@${message.sender}` })
    }).filter(Boolean);

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
                    createMessage({ variables: { username, gid: selectedGroup, content: encryptMessage(messageInput, "text", selectedGroup), cType: "text" } });
                }
              }}/>
            </Form.Group>
        </Form>
    </div>;
}

export default ChatFeed;