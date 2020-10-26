import React from 'react';

import {
    gql,
    useQuery
} from '@apollo/client';

import ChatFeed from './ChatFeed.react';

const GET_MESSAGES = gql`
    query getMessagesForGroup($gid: Int!, $offset: Int, $limit: Int) {
        messagesByGroup(gid: $gid, count: $limit, offset: $offset){
            id
            content
            ts
            sender
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
        }
    }
`;

function ChatMessages({
    selectedGroup, doneFetching, setDoneFetching
}) {
    const { subscribeToMore, loading, error, data, fetchMore } = useQuery(
        GET_MESSAGES,
        {
            variables: {
                gid: selectedGroup,
                offset: 0,
                limit: 2
            },
            fetchPolicy: "cache-and-network"
        }
    );

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    return <ChatFeed entries={data} doneFetching={doneFetching} onLoadMore={() => {
        if (doneFetching) {
            return;
        }
        return fetchMore({
            variables: {
                offset: data.messagesByGroup.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                console.log(fetchMoreResult.messagesByGroup);
                if (fetchMoreResult.messagesByGroup.length === 0) {
                    setDoneFetching(true);
                }
                return Object.assign({}, prev, {
                    messagesByGroup: [...prev.messagesByGroup, ...fetchMoreResult.messagesByGroup],
                });
            }
        })
    }}
        subscribeToNewMessages={() =>
            subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
                variables: { gid: selectedGroup },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newFeedItem = subscriptionData.data.newMessage;
                    return Object.assign({}, prev, {
                        messagesByGroup: [newFeedItem, ...prev.messagesByGroup]
                    });
                }
            })
        }
    >
    </ChatFeed>;
}

export default ChatMessages;