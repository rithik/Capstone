import React, { useState } from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { gql, useMutation } from '@apollo/client';
import { generateGroupKeys } from '../utils/generateKeys'
import { encryptMessageForPrivateKey } from '../utils/AESEncryption';
import {encryptLocalStorage} from '../utils/localStorageKeyGen';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    mutation createPrivateKey($username: String!, $privateKey: String!, $gid: Int!){
        createPrivateKey(username:$username, gid:$gid, privateKey:$privateKey){
            id
            privateKey
        }
    }
`;

const UPDATE_KEYS = gql`
    mutation updateKeys($username: String!, $keys: String!){
        updateKeys(username:$username, keys:$keys){
            success
        }
    }
`;

function GroupChatTags({ show, setShow }) {
    const [tags, setTags] = useState([]);

    const handleClose = () => setShow(false);
    const [groupName, setgroupName] = useState("");
    const [updateKeys] = useMutation(UPDATE_KEYS);
    const [createPrivateKey] = useMutation(SEND_MESSAGE);
    const [createGroup] = useMutation(CREATE_GROUP, {
        onCompleted({ createGroup }) {
            const username = localStorage.getItem('username');
            const privateKey = localStorage.getItem('temp-group-privatekey')
            localStorage.setItem(`${createGroup.id}-privateKey`, privateKey);
            localStorage.removeItem('temp-group-privatekey');
            createGroup.users.map(user => {
                const content = encryptMessageForPrivateKey(privateKey, user);
                createPrivateKey({ variables: { username: user.username, gid: createGroup.id, privateKey: content} });
                return true;
            });
            updateKeys({variables: {username, keys: encryptLocalStorage()}});
            handleClose();
        }
    });

    const createGroupChat = (raw_tags, groupName) => {
        raw_tags.push(localStorage.getItem('username')) // transparently include current user in every group they create
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var tags = raw_tags.filter(onlyUnique);
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
            <Modal show={show} transparent={"true"} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Input the individuals to add to your new Group Chat!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <TagsInput value={tags} onChange={(newTags) => setTags(newTags)} inputProps={{
                        className: 'react-tagsinput-input',
                        placeholder: 'Add people!'
                    }} onlyUnique />
                    <Form style={{marginTop: "20px"}}>
                        <Form.Group>
                            <Form.Control type="text" placeholder="GroupName" value={groupName} onChange={(e) => setgroupName(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                        <Button variant="primary" onClick={() => createGroupChat(tags, groupName)}>
                            Create Group!
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>);
}
export default GroupChatTags;
