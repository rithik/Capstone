import React, { useEffect, useState } from 'react';

import { ChatFeed as ChatFeedUI, Message } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function ChatFeed({
    entries,
    onLoadMore, 
    doneFetching,
    subscribeToNewMessages
}) {
    const [firstLoad, setFirstLoad] = useState(true);
    let messagesEndRef = React.createRef();
    let messagesStartRef = React.createRef();

    window.lm = onLoadMore;
    const reversedEntries = [].concat(entries.messagesByGroup).reverse();
    const messages = reversedEntries.map(message => {
        return new Message({ id: message.sender === 'user4' ? 0 : message.sender, message: message.content, senderName: `@${message.sender}` })
    })
    useEffect(() => {
        if (firstLoad) {
            messagesEndRef.scrollIntoView({ behavior: "smooth" });
            subscribeToNewMessages();
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
        setFirstLoad(false);
    }, [firstLoad, setFirstLoad, onLoadMore, messagesStartRef, messagesEndRef]);
    console.log(entries);
    return <div style={{ marginLeft: '10px', marginRight: '10px' }}>
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
    </div>;
}

export default ChatFeed;