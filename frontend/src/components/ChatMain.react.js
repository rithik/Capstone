import React, { useState } from 'react';
import ChatLeftList from './ChatLeftList.react';
import ChatMessages from './ChatMessages.react';
import Button from 'react-bootstrap/Button';
import './../App.css';
import {
    gql,
    useMutation
} from '@apollo/client';
import Avatar from 'react-avatar';

import { ThemeProvider, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit'
import GroupChatTags from './GroupChatTags.react';
import Form from 'react-bootstrap/Form';
import { encryptMessage } from '../utils/AESEncryption';
import 'bootstrap/dist/css/bootstrap.min.css';

const SEND_MESSAGE = gql`
    mutation SendMessage($username: String!, $content: String!, $gid: Int!, $cType: String!){
        createMessage(sender:$username, group:$gid, content:$content, cType:$cType){
            id
            content
            ts
        }
    }
`;
const themes = {
    defaultTheme: {
        FixedWrapperMaximized: {
            css: {
                boxShadow: '0 0 1em rgba(0, 0, 0, 0.1)',
            },
        },
        OwnMessage: {
            ...defaultTheme.OwnMessage,
            backgroundColor: '#456456',
            secondaryTextColor: '#456456',
        },
    },
    purpleTheme: {
        ...purpleTheme,
        TextComposer: {
            ...purpleTheme.TextComposer,
            css: {
                ...purpleTheme.TextComposer.css,
                marginTop: '1em',
            },
        },
        OwnMessage: {
            ...purpleTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
    },
    elegantTheme: {
        ...elegantTheme,
        Message: {
            ...darkTheme.Message,
            secondaryTextColor: '#fff',
        },
        OwnMessage: {
            ...darkTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
    },
    darkTheme: {
        ...darkTheme,
        vars: {
            ...darkTheme.vars,
            "tertiary-color": "rgba(40, 40, 40, 0.8)"
        },
        Message: {
            ...darkTheme.Message,
            css: {
                ...darkTheme.Message.css,
                color: '#fff',
            },
        },
        OwnMessage: {
            ...darkTheme.OwnMessage,
            secondaryTextColor: '#fff',
        },
        TitleBar: {
            ...darkTheme.TitleBar,
            css: {
                ...darkTheme.TitleBar.css,
                padding: '1em',
            },
        },
    },
}

function ChatMain({ client }) {
    console.log(themes.darkTheme);
    const username = localStorage.getItem('username');
    const [messageInput, setMessageInput] = useState("");
    const [createMessage] = useMutation(SEND_MESSAGE);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [doneFetching, setDoneFetching] = useState(false)
    const [show, setShow] = useState(false);

    const logout = () => {
        localStorage.clear();
        let fullURL = window.location.href.split('/');
        fullURL.pop();
        const baseURL = fullURL.join('/')
        window.location.href = baseURL;
    }

    return (<div className="main">
        <GroupChatTags show={show} setShow={setShow} />
        <ThemeProvider theme={themes.darkTheme}>
            <div style={{
                height: "100%",
                width: "30%",
                position: "fixed",
                zIndex: 1,
                top: 0,
                overflowX: 'hidden',
                paddingTop: '20px',
                left: 0
            }}>
                <div style={{ verticalAlign: 'middle', fontSize: 24 }}>
                    <Avatar name={username} size={50} round style={{ marginBottom: 20, marginLeft: 25 }} title={`@${username}`} /> {`@${username}`}
                </div>
                <div className="App" style={{marginBottom: 10}}>
                    <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => setShow(!show)}>Create Group Chat</Button>
                    <Button variant="secondary" onClick={logout}>Logout</Button>
                </div>
                <ChatLeftList client={client} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} setDoneFetching={setDoneFetching}>
                </ChatLeftList>
            </div>

            <div style={{
                height: "100%",
                width: "70%",
                position: "fixed",
                zIndex: 1,
                top: 0,
                overflowX: 'hidden',
                right: 0,
                border: "1px solid rgba(108, 117, 125, 0.1)",
            }}>
                {
                    selectedGroup && (
                        <>
                            <ChatMessages selectedGroup={selectedGroup} doneFetching={doneFetching} setDoneFetching={setDoneFetching} />
                            <Form style={{ width: "68%", bottom: "20px", position: "fixed", marginLeft: '0', marginRight: '0', display: "block", left: "31%" }}>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter message" value={messageInput} style={{backgroundColor: "#363636", color: "white", borderColor: "#363636"}} onChange={e => setMessageInput(e.target.value)} onKeyPress={event => {
                                        if (event.key === 'Enter' && event.target.value !== "") {
                                            event.preventDefault()
                                            createMessage({ variables: { username, gid: selectedGroup, content: encryptMessage(messageInput, "text", selectedGroup), cType: "text" } });
                                            setMessageInput("");
                                        }
                                    }} />
                                </Form.Group>
                            </Form>
                        </>
                    )}
            </div>
        </ThemeProvider>
    </div>);
}

export default ChatMain;