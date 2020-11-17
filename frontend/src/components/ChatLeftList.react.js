import React, { useEffect } from 'react';

import {
  gql,
  useQuery
} from '@apollo/client';

import { Avatar } from '@livechat/ui-kit'
import { ChatList } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import './../App.css';
import 'react-chat-elements/dist/main.css';

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

  const stringToColor = (groupName) => {
    var hash = 0;
    for (var i = 0; i < groupName.length; i++) {
      hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }

  const dataSource = data.groupsByUser.map(group => {
    if (localStorage.getItem(`${group.id}-privateKey`) == null || localStorage.getItem(`${group.id}-privateKey`) === 'undefined') {
      localStorage.setItem(`${group.id}-privateKey`, decryptMessageForPrivateKey(group.privateKey));
    }
    const users = group.users.map(user => `@${user.username}`);
    return {
      letterItem: { letter: group.name.charAt(0).toUpperCase(), id: stringToColor(group.name) },
      alt: group.name,
      title: group.name,
      subtitle: users.join(", "),
      date: new Date(),
      unread: 0,
      id: group.id,
      className: selectedGroup === group.id ? "activeChatLeft" : "notActiveChatLeft"
    }
  });

  console.log(dataSource);

  return (<ChatList onClick={(chat) => { console.log(chat); setSelectedGroup(chat.id); setDoneFetching(false);}}
    style={{
      backgroundColor: "#121212"
    }}
    dataSource={dataSource} />)
}

export default ChatLeftList;