import React, { useEffect } from 'react';

import {
    gql,
    useQuery
} from '@apollo/client';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import ChatFeed from './ChatFeed.react';

const GET_MESSAGES = gql`
    query getMessagesForGroup($gid: Int!, $offset: Int, $limit: Int) {
        messagesByGroup(gid: $gid, count: $limit, offset: $offset){
            id
            content
            ts
            sender
            group
            cType
        }
    }
`;

const MESSAGE_SUBSCRIPTION = gql`
    subscription getNewMessages($gid: Int!){
        newMessage(gid: $gid){
            id
            content
            ts
            sender
            group
            cType
        }
    }
`;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function ChatMessages({
    selectedGroup, doneFetching, setDoneFetching, subscriptions, setSubscriptions
}) {
    const { subscribeToMore, loading, error, data, fetchMore } = useQuery(
        GET_MESSAGES,
        {
            variables: {
                gid: selectedGroup,
                offset: 0,
                limit: 50
            },
            fetchPolicy: "cache-and-network"
        }
    );

    useEffect(() => {
        const subscription = subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            variables: { gid: selectedGroup },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                console.log(subscriptionData, selectedGroup);
                const newFeedItem = subscriptionData.data.newMessage;
                return Object.assign({}, prev, {
                    messagesByGroup: [newFeedItem, ...prev.messagesByGroup]
                });
            }
        });
        return function cleanup() {
            subscription();
        };
    }, [subscribeToMore, selectedGroup]);

    if (loading) return (<div style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '50px' }}>
        <div style={{ height: '30px' }}>
            {
                !doneFetching && <ClipLoader
                    css={override}
                    size={30}
                    color={"#123abc"}
                    loading={true}
                />
            }
        </div>
    </div>);
    if (error) return `Error! ${error.message}`;
    return <ChatFeed entries={data} selectedGroup={selectedGroup} doneFetching={doneFetching} onLoadMore={() => {
        if (doneFetching) {
            return;
        }
        return fetchMore({
            variables: {
                offset: data.messagesByGroup.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (fetchMoreResult.messagesByGroup.length === 0) {
                    setDoneFetching(true);
                }
                return Object.assign({}, prev, {
                    messagesByGroup: [...prev.messagesByGroup, ...fetchMoreResult.messagesByGroup],
                });
            }
        })
    }}>
    </ChatFeed>;
}

export default ChatMessages;