import React, { useState } from 'react';
import ChatLeftList from './ChatLeftList.react';
import ChatMessages from './ChatMessages.react';
import './../App.css';
import Modal from './Modal.react'
import useModal from './useModal';

import { ThemeProvider, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit'

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
    const {isShowing, toggle} = useModal();

    return (<ThemeProvider theme={themes.defaultTheme}>
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
				<button className="button-default" onClick={toggle}>Create Group Chat</button>
				<Modal
					isShowing={isShowing}
					hide={toggle}
				/>
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
        

    </ThemeProvider>);
}

export default ChatMain;