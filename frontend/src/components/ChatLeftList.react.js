import React, {useEffect, useState} from 'react';

import {
  gql,
  useQuery
} from '@apollo/client';

import { ChatList, ChatListItem, Avatar, Column, Row, Title, Subtitle } from '@livechat/ui-kit'

const GET_GROUPS = gql`
  query getGroupsWithUser($username: String!) {
    groupsByUser(username: $username){
      id
      name
      users {
        username
      }
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
        }
    }
`;

function ChatLeftList({ selectedGroup, setSelectedGroup, setDoneFetching }) {
  const username = localStorage.getItem('username');
  const [firstLoad, setFirstLoad] = useState(false);

  const {
    subscribeToMore,
    loading,
    error,
    data
  } = useQuery(GET_GROUPS, {
    variables: {
      username
    }
  });

  const subscribeToNewMessages = () => {
    subscribeToMore({
      document: GROUP_SUBSCRIPTION,
      variables: { username },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newGroup = subscriptionData.data.newGroup;
        return Object.assign({}, prev, {
          groupsByUser: [newGroup, ...prev.groupsByUser]
        });
      }
    })
  };

  useEffect(() => {
    if (!firstLoad){
      setFirstLoad(true);
      subscribeToNewMessages();
    }
  }, [firstLoad]);


  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const groupDivs = data.groupsByUser.map(group => {
    const users = group.users.map(user => `@${user.username}`);
    return (
      <div key={group.id} onClick={() => { setSelectedGroup(group.id); setDoneFetching(false) }}>
        <ChatListItem active={group.id === selectedGroup}>
          <Avatar letter={group.name.charAt(0).toUpperCase()} />
          <Column fill>
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