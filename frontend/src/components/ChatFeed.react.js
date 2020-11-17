import React, { useEffect } from 'react';
import { ChatFeed as ChatFeedUI } from 'react-chat-ui';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-chat-elements/dist/main.css';
import { MessageList } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import {dataURLtoFile} from './../utils/files';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function ChatFeed({
    messages,
    onLoadMore,
    doneFetching,
    selectedGroup,
}) {
    let messagesEndRef = React.createRef();
    let messagesStartRef = React.createRef();

    window.lm = onLoadMore;

    useEffect(() => {
        messagesEndRef.scrollIntoView({ behavior: "smooth" });
        const interval = setInterval(() => {
            const offset = 0;
            if (!messagesStartRef) return false;
            const top = messagesStartRef.getBoundingClientRect().top;
            const inView = (top + offset) >= 0 && (top - offset) <= window.innerHeight;
            if (inView) {
                // onLoadMore();
            }
        }, 1000);
        return function cleanup() {
            clearInterval(interval);
        }
    }, [onLoadMore, messagesStartRef, messagesEndRef]);

    const height = window.innerHeight * 0.86;
    const username = localStorage.getItem('username');
    const dataSource = messages.map(messagebox => {
        console.log(messagebox);
        if (messagebox.cType === "text") {
            return {
                position: messagebox.sender === username ? 'right' : 'left',
                type: 'text',
                text: messagebox.message.message,
                title: messagebox.senderName,
                date: new Date(parseInt(messagebox.ts)),
            };
        }
        if (messagebox.cType === "photo") {
            return {
                position: messagebox.sender === username ? 'right' : 'left',
                type: 'photo',
                title: messagebox.senderName,
                date: new Date(parseInt(messagebox.ts)),
                data: {
                    uri: messagebox.message.content,
                    filename: messagebox.message.filename,
                    status: {
                        click: false,
                        loading: 0,
                    },
                    width: "300px",
                    height: "150px"
                }
            };
        }
        if (messagebox.cType === "file") {
            return {
                position: messagebox.sender === username ? 'right' : 'left',
                type: 'file',
                text: messagebox.message.filename,
                title: messagebox.senderName,
                date: new Date(parseInt(messagebox.ts)),
                data: {
                    uri: messagebox.message.content,
                    status: {
                        click: false,
                        loading: 0,
                    }
                }
            };
        }
        return null;
    }).filter(Boolean);

    return <div style={{ marginLeft: 5, marginRight: 5, marginBottom: 50 }}>

        <div style={{ height: 30 }}
            ref={(el) => { messagesStartRef = el; }}>
            {
                // doneFetching ? <div /> : <ClipLoader
                //     css={override}
                //     size={30}
                //     color={"#123abc"}
                //     loading={true}
                // />
            }
        </div>
        <div style={{ }}>
            <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'86%'}
                onDownload={(e) => {
                    console.log(e); 
                    dataURLtoFile(e.data.uri, e.type === 'photo' ? e.data.filename : e.text)
                }}
                dataSource={dataSource}
            />
        </div>
        <div style={{ float: "left", clear: "both" }}
            ref={(el) => { messagesEndRef = el; }}>
        </div>
    </div>;
}

export default ChatFeed;