import React, { useState } from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { gql, useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import {generateGroupKeys} from '../utils/generateKeys'
import { encryptMessageForPrivateKey } from '../utils/AESEncryption';

const CREATE_GROUP = gql`
mutation createGroup($name: String!, $publicKey: String!, $users: [String!]){
    createGroup(name:$name, publicKey:$publicKey, users:$users){
      id
      name
      publicKey
      users{
          username
          publicKey
      }
    }
  }
`;

const SEND_MESSAGE = gql`
    mutation SendMessage($username: String!, $content: String!, $gid: Int!, $cType: String!){
        createMessage(sender:$username, group:$gid, content:$content, cType: $cType){
            id
            content
            ts
            cType
        }
    }
`;

function GroupChatTags() {
    const [tags, setTags] = useState([]);
    const [groupName, setgroupName] = useState("");
    const [createMessage] = useMutation(SEND_MESSAGE);
    const [createGroup] = useMutation(CREATE_GROUP, {
        onCompleted({ createGroup }) {
            const username  = localStorage.getItem('username');
            const privateKey = localStorage.getItem('temp-group-privatekey')
            localStorage.setItem(`${createGroup.id}-privateKey`, privateKey);
            localStorage.removeItem('temp-group-privatekey');
            createGroup.users.map(user => {
                const content = encryptMessageForPrivateKey(privateKey, user);
                console.log(content);
                createMessage({ variables: { username, gid: createGroup.id, content, cType: `group-private-key-${user.username}` } });
            });
        }
    });

    const createGroupChat = (tags, groupName) => {
        if (tags && tags.length > 0) {

            const x = Promise.resolve(generateGroupKeys(groupName)).then(function (array) {
                const publicKey = array.publicKey
                const privateKey = array.privateKey
                localStorage.setItem('temp-group-privatekey', privateKey);
                createGroup({ variables: { users: tags, publicKey: publicKey, name: groupName } });

            });
        }
        else {
            console.log("Error, you have no individuals to add to the group")
        }
    }

    return (
        <div>
            <TagsInput value={tags} onChange={(newTags) => setTags(newTags)} inputProps={{
                className: 'react-tagsinput-input',
                placeholder: 'Add people!'
            }} onlyUnique />
            <TextField value={groupName} label="Group Name" onChange={(e) => setgroupName(e.target.value)}></TextField>
            <button className="button-default" onClick={() => createGroupChat(tags, groupName)}>Create Group!</button>
        </div>);
}
export default GroupChatTags;
