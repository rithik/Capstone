import React from 'react';
import ChatLeftList from './ChatLeftList.react';
import { ThemeProvider } from '@livechat/ui-kit'
import './../App.css';

function ChatMain() {
    return (<ThemeProvider>
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
            <ChatLeftList>
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
            right: 0
        }}>
        </div>

    </ThemeProvider>);
}

export default ChatMain;