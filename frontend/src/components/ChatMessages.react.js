import React, { useState } from 'react';

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

function ChatLeftList() {
    const [doneFetching, setDoneFetching] = useState(false)
    const { loading, error, data, fetchMore } = useQuery(
        GET_MESSAGES,
        {
            variables: {
                gid: 13,
                offset: 0,
                limit: 2
            },
            fetchPolicy: "cache"
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
    }
    }>
    </ChatFeed>;
}

export default ChatLeftList;