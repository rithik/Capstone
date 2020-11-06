import React, { useEffect } from 'react';

import {
  gql,
  useQuery
} from '@apollo/client';

import { ChatList, ChatListItem, Avatar, Column, Row, Title, Subtitle } from '@livechat/ui-kit'

import { decryptMessageForPrivateKey } from '../utils/AESEncryption';

const GET_GROUPS = gql`
  query getGroupsWithUser($username: String!) {
    groupsByUser(username: $username){
      id
      name
      users {
        username
      }
      privateKey
    }
  }
`;

const GROUP_SUBSCRIPTION = gql`
    subscription getNewGroups($username: String!){
        newGroup(username: $username){
          id
          users{
            username
          }
          name
          publicKey
          privateKey
        }
    }
`;

function ChatLeftList({ selectedGroup, setSelectedGroup, setDoneFetching, client }) {
  const username = localStorage.getItem('username');

  const {
    subscribeToMore,
    loading,
    error,
    data,
    refetch
  } = useQuery(GET_GROUPS, {
    variables: {
      username
    }
  });

  useEffect(() => {
    const subscribe = subscribeToMore({
      document: GROUP_SUBSCRIPTION,
      variables: { username },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newGroup = subscriptionData.data.newGroup;
        localStorage.setItem(`${newGroup.id}-privateKey`, decryptMessageForPrivateKey(newGroup.privateKey));
        return Object.assign({}, prev, {
          groupsByUser: [newGroup, ...prev.groupsByUser]
        });
      }
    });
    return function cleanup() {
      subscribe();
    };
  }, [subscribeToMore, username]);


  if (loading) return 'Loading...';
  if (error) {
    client.resetStore();
    refetch();
    return `Error! ${error.message}`;
  }

  const groupDivs = data.groupsByUser.map(group => {
    if (localStorage.getItem(`${group.id}-privateKey`) == null || localStorage.getItem(`${group.id}-privateKey`) === 'undefined') {
      localStorage.setItem(`${group.id}-privateKey`, decryptMessageForPrivateKey(group.privateKey));
    }
    const users = group.users.map(user => `@${user.username}`);
    return (
      <div key={group.id} onClick={() => { setSelectedGroup(group.id); setDoneFetching(false) }}>
        <ChatListItem active={group.id === selectedGroup}>
          <Avatar letter={group.name.charAt(0).toUpperCase()} />
          <Column fill="true">
            <Row justify>
              <Title ellipsis>{group.name}</Title>
            </Row>
            <Row justify>
              <Subtitle ellipsis>{users.join(", ")}</Subtitle>
            </Row>
          </Column>
        </ChatListItem>
      </div>
    )
  });

  return (<ChatList style={{ maxWidth: '100%' }}>
    {groupDivs}
  </ChatList>);
}

export default ChatLeftList;