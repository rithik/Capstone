import React, { useState } from 'react';
import ChatLeftList from './ChatLeftList.react';
import ChatMessages from './ChatMessages.react';
import Button from 'react-bootstrap/Button';
import './../App.css';

import { ThemeProvider, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit'
import GroupChatTags from './GroupChatTags.react';

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

function ChatMain() {
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

    return (<>
    <GroupChatTags show={show} setShow={setShow} />
        <ThemeProvider theme={themes.defaultTheme}>
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
                <div className="App">
                    <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => setShow(!show)}>Create Group Chat</Button>
                    <Button variant="secondary" onClick={logout}>Logout</Button>
                </div>
                <ChatLeftList selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} setDoneFetching={setDoneFetching}>
                </ChatLeftList>
            </div>

            <div style={{
                height: "100%",
                width: "70%",
                position: "fixed",
                zIndex: 1,
                top: 0,
                overflowX: 'hidden',
                paddingTop: '20px',
                right: 0,
                border: "1px solid rgba(0,0,0,0.1)",
            }}>
                {
                    selectedGroup && <ChatMessages selectedGroup={selectedGroup} doneFetching={doneFetching} setDoneFetching={setDoneFetching}></ChatMessages>
                }
            </div>
        </ThemeProvider>
    </>);
}

export default ChatMain;