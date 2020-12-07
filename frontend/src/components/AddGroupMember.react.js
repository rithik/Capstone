import React, { useState } from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { gql, useMutation } from '@apollo/client';
import { generateKeys } from '../utils/generateKeys'
import { encryptMessageForPrivateKey } from '../utils/AESEncryption';
import {encryptLocalStorage} from '../utils/localStorageKeyGen';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const ADD_MEMBER_GROUP = gql`
mutation addMemberToGroup($gid: Int!, $users: [String!]){
    addGroupMember(gid:$gid, users:$users){
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

function AddGroupMember({ show, setShow, groupId }) {
    const [tags, setTags] = useState([]);

    const handleClose = () => setShow(false);
    const [groupName, setgroupName] = useState("");
    const [updateKeys] = useMutation(UPDATE_KEYS);
    const [createPrivateKey] = useMutation(SEND_MESSAGE);
    const [addToGroup] = useMutation(ADD_MEMBER_GROUP, {
        onCompleted({addGroupMember}) {
            const username = localStorage.getItem('username');
            const privateKey = localStorage.getItem(`${addGroupMember.id}-privateKey`);
            addGroupMember.users.map(user => {
                const content = encryptMessageForPrivateKey(privateKey, user);
                createPrivateKey({ variables: { username: user.username, gid: addGroupMember.id, privateKey: content} });
                return true;
            });
            updateKeys({variables: {username, keys: encryptLocalStorage()}});
            handleClose();
        }
    });

    const addMemberToGroup = (raw_tags) => {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var tags = raw_tags.filter(onlyUnique);
        if (tags && tags.length > 0) {
            addToGroup({ variables: { users: tags, gid: parseInt(groupId) } });
        }
    }

    return (
        <div style={{backgroundColor: "#2e2e2e"}}>
            <Modal show={show} transparent={"true"} onHide={handleClose}>
                <Modal.Header closeButton style={{backgroundColor: "#2e2e2e", borderColor: "#2e2e2e"}}>
                    <Modal.Title>Input the individuals to add to your this group!</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{backgroundColor: "#2e2e2e", borderColor: "#2e2e2e"}}>
                    <TagsInput style={{color: "white"}} value={tags} onChange={(newTags) => setTags(newTags)} inputProps={{
                        className: 'react-tagsinput-input',
                        placeholder: 'Add people!'
                    }} onlyUnique />
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: "#2e2e2e", borderColor: "#2e2e2e"}}>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                        <Button variant="primary" onClick={() => addMemberToGroup(tags)}>
                            Add Members!
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>);
}
export default AddGroupMember;
