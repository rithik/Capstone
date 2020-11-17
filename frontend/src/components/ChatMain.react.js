import React, { useState, useRef } from 'react';
import ChatLeftList from './ChatLeftList.react';
import ChatMessages from './ChatMessages.react';
import Button from 'react-bootstrap/Button';
import './../App.css';
import {
    gql,
    useMutation
} from '@apollo/client';
import Avatar from 'react-avatar';
import { Input, Button as ChatButton } from 'react-chat-elements'
import { ThemeProvider, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit'
import GroupChatTags from './GroupChatTags.react';
import Form from 'react-bootstrap/Form';
import { encryptMessage } from '../utils/AESEncryption';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-chat-elements/dist/main.css';
import {convertFileToBase64} from './../utils/files';

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
    const inputEl = useRef(null);
    const fileUploader = useRef(null);
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
                <div className="App" style={{ marginBottom: 10 }}>
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
                borderLeft: "1px solid white",
            }}>
                {
                    selectedGroup && (
                        <>
                        <div styles={{overflow:"hidden"}}>
                            <div style = {{height:"90%", position:"relative",}}>
                                <ChatMessages selectedGroup={selectedGroup} doneFetching={doneFetching} setDoneFetching={setDoneFetching} />
                            </div>
                            <div style = {{paddingLeft: "1px", height:"5%", bottom:"1%", position:"fixed", width:"68%"}}>
                                <Input
                                    placeholder="Enter message"
                                    defaultValue=""
                                    ref={inputEl}
                                    multiline={true}
                                    // buttonsFloat='left'
                                    // maxHeight= {0}
                                    // minHeight = {0}
                                    // autoHeight = {false}
                                    onKeyPress={(e) => {
                                        if (e.shiftKey && e.charCode === 13) {
                                            return true;
                                        }
                                        if (e.charCode === 13 && inputEl.current.input.value.trim()!=="") {
                                            createMessage({ variables: { username, gid: selectedGroup, content: encryptMessage(inputEl.current.input.value, "text", selectedGroup), cType: "text" } });
                                            inputEl.current.clear();
                                            e.preventDefault();
                                            return false;
                                        }
                                    }}
                                    rightButtons={
                                        <>
                                            <input
                                                id="raised-button-file"
                                                style = {{display:"none"}}
                                                type="file"
                                                ref={fileUploader}
                                                onChange={(event, newValue) => {
                                                    console.log(event.target.files);
                                                    convertFileToBase64(event, selectedGroup, createMessage, username)
                                                    // createMessage({ variables: { username, gid: selectedGroup, content: convertFileToBase64(event, selectedGroup), cType: "file" } });
                                                    event.preventDefault();
                                                }}
                                            />
                                        <ChatButton text='Upload' onClick={()=>{fileUploader.current.click()}}>
                                        </ChatButton>
                                        <ChatButton
                                        text='Send'
                                        onClick={(e) => {
                                            if(inputEl.current.input.value.trim()!==""){
                                                createMessage({ variables: { username, gid: selectedGroup, content: encryptMessage(inputEl.current.input.value, "text", selectedGroup), cType: "text" } });
                                                inputEl.current.clear();
                                                e.preventDefault();
                                            }
                                        }} />
                                    </>
                                    } />
                            </div>
                        </div>

                            
                            
                            {/* <Form style={{ width: "68%", bottom: "20px", position: "fixed", marginLeft: '0', marginRight: '0', display: "block", left: "31%" }}>
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Enter message" value={messageInput} style={{backgroundColor: "#363636", color: "white", borderColor: "#363636"}} onChange={e => setMessageInput(e.target.value)} onKeyPress={event => {
                                        if (event.key === 'Enter' && event.target.value !== "") {
                                            event.preventDefault()
                                            createMessage({ variables: { username, gid: selectedGroup, content: encryptMessage(messageInput, "text", selectedGroup), cType: "text" } });
                                            setMessageInput("");
                                        }
                                    }} />
                                </Form.Group>
                            </Form> */}
                        </>
                    )}
            </div>
        </ThemeProvider>
    </div >);
}

export default ChatMain;