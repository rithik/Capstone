import React, { useState } from 'react';

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
      users
    }
  }
`;

function ChatLeftList() {
  const {
    loading,
    error,
    data
  } = useQuery(GET_GROUPS, {
    variables: {
      username: "user4"
    }
  });
  const [selected, setSelected] = useState(0);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const groupDivs = data.groupsByUser.map(group => {
    const users = group.users.map(username => `@${username}`);
    return (
      <div key={group.id} onClick={() => setSelected(group.id)}>
        <ChatListItem active={group.id === selected}>
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