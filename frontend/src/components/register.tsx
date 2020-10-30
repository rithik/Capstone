import React, {useState} from 'react';
import './../App.css';
import generateKeys from '../utils/generateKeys'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import {setCookie, getCookie, deleteCookie} from '../utils/cookieManager'
import { gql, useMutation } from '@apollo/client';


const CREATE_USER = gql`
	mutation CreateUser($username: String!, $publicKey: String!){
	  createUser(username:$username, publicKey:$publicKey){
	    id
	    username
	    publicKey
	  }
	}
`;
const CREATE_TOKEN = gql`
	mutation CreateToken($username: String!, $publicKey: String!){
		  createToken(username:$username, publicKey:$publicKey){
		    token
		    username
		}
	}
`;


function Register() {
	const [createUser] = useMutation(CREATE_USER);
	const [createToken] = useMutation(CREATE_TOKEN, {
	    onCompleted({ token, username }) {
	      localStorage.setItem('token', token as string);
	      localStorage.setItem('username', username as string);
	    }
	});
	const [myUsernameValue, setUsernameValue] = useState('');

	function sendData(myUsernameValue: any) {
		const x = Promise.resolve(generateKeys(myUsernameValue)).then(function (array) {
				const publicKey = array.publicKey
				const privateKey = array.privateKey
				console.log(myUsernameValue)
				console.log(publicKey)
				console.log(privateKey)
				createUser({ variables: { username: myUsernameValue, publicKey: publicKey } });
				createToken({ variables: { username: myUsernameValue, publicKey: publicKey } });
				localStorage.setItem('user-privateKey', privateKey as string);
        });
	}

	return (
		<div className="Register">
			<TextField 
				InputProps={{style: {color: "white"} }} 
				id="outlined-basic" label="Username" 
				variant="outlined" 
				value={myUsernameValue}
				onChange={(e) => setUsernameValue(e.target.value)} 
			/>
			<br/>
			<br/>
			<Button onClick={(e) => {
				e.preventDefault(); 
				sendData(myUsernameValue);
			}} variant="contained" color="primary">
			  Register
			</Button>
		</div>
	);
}

export default Register;
