import React, { useEffect } from 'react';
import { ChatFeed as ChatFeedUI, Message } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import { decryptMessage } from '../utils/AESEncryption';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function ChatFeed({
    entries,
    onLoadMore,
    doneFetching,
    selectedGroup,
}) {
    let messagesEndRef = React.createRef();
    let messagesStartRef = React.createRef();

    window.lm = onLoadMore;
    const reversedEntries = [].concat(entries.messagesByGroup).reverse();
    const username = localStorage.getItem('username');
    const messages = reversedEntries.map(message => {
        if (localStorage.getItem(`${selectedGroup}-privateKey`) == null || localStorage.getItem(`${selectedGroup}-privateKey`) === 'undefined') {
            return null;
        }
        return new Message({ id: message.sender === username ? 0 : message.sender, message: decryptMessage(message.content, selectedGroup).message, senderName: `@${message.sender}` })
    }).filter(Boolean);


    useEffect(() => {
        messagesEndRef.scrollIntoView({ behavior: "smooth" });
        const interval = setInterval(() => {
            const offset = 0;
            if (!messagesStartRef) return false;
            const top = messagesStartRef.getBoundingClientRect().top;
            const inView = (top + offset) >= 0 && (top - offset) <= window.innerHeight;
            if (inView) {
                onLoadMore();
            }
        }, 1000);
        return function cleanup(){
            clearInterval(interval);
        }
    }, [onLoadMore, messagesStartRef, messagesEndRef]);
    const height = window.innerHeight * 0.86
    return <div style={{ marginLeft: 5, marginRight: 5, marginBottom: 50 }}>
        
        <div style={{ height: 30 }}
            ref={(el) => { messagesStartRef = el; }}> 
            {
                doneFetching ? <div/> : <ClipLoader
                    css={override}
                    size={30}
                    color={"#123abc"}
                    loading={true}
                />
            }
        </div>
        <div style={{maxHeight: height}}>
            <ChatFeedUI
                maxHeight = {height}                
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
                            padding: 15, 
                            backgroundColor: "#363636"
                        }, 
                        userBubble: {
                            backgroundColor: '#0084ff', 
                        }
                    }
                }
            />
        </div>
        <div style={{ float: "left", clear: "both" }}
            ref={(el) => { messagesEndRef = el; }}>
        </div>
    </div>;
}

export default ChatFeed;