import React, { useState } from 'react';
import './../App.css';
import {generateKeys} from '../utils/generateKeys'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { gql, useMutation, useQuery } from '@apollo/client';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';


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
const GET_USER = gql`
	query User($username: String!){
		user(username:$username){
			username
			id
		}
	}
`;

const styles = theme => ({
	notchedOutline: {
	  borderWidth: "1px",
	  borderColor: "yellow !important"
	}
  });

// register the user
function Register() {
	const [createUser] = useMutation(CREATE_USER);
	const [createToken] = useMutation(CREATE_TOKEN, {
		onCompleted({ createToken }) {
			localStorage.setItem('token', createToken.token);
			localStorage.setItem('username', createToken.username);
			window.location.href = 'http://localhost:3000/main';
		}
	});
	const [myUsernameValue, setUsernameValue] = useState('');
	const [usernameError, setUsernameError] = useState(false);

	const {loading, error, data} = useQuery(GET_USER, {
		variables: { username: myUsernameValue },
	});

	function sendData(myUsernameValue) {
		if (error){
			console.log('error in username')
			setUsernameError(true)
		}
		else {
			if(data['user'] == undefined){
				setUsernameError(false)
				const x = Promise.resolve(generateKeys(myUsernameValue)).then(function (array) {
					const publicKey = array.publicKey
					const privateKey = array.privateKey
					createUser({ variables: { username: myUsernameValue, publicKey: publicKey } });
					localStorage.setItem('user-privateKey', privateKey);
					createToken({ variables: { username: myUsernameValue, publicKey: publicKey } });
				});
			}
			else{
				console.log('username exists')
				setUsernameError(true)
			}
		}
	}

	return (
		<div className="Register">
			<TextField
				InputProps={{ 
					style: { color: "white" },
				}}
				id="outlined-basic" label="Username"
				variant="outlined"
				value={myUsernameValue}
				color={'white'}
				onChange={(e) => setUsernameValue(e.target.value)}
			/>
			<br />
			<br />
			<Button onClick={(e) => {
				e.preventDefault();
				sendData(myUsernameValue);
			}} variant="contained" color="primary">
				Register
			</Button>
			<br />
			<br />
			<Collapse in={usernameError}>
				<Alert
				action={
					<IconButton
					aria-label="close"
					color="inherit"
					size="small"
					onClick={() => {
						setUsernameError(false);
					}}
					>
					<CloseIcon fontSize="inherit" />
					</IconButton>
				}
				variant="filled" severity="error"
				>
				Invalid username - choose a unique username
				</Alert>
			</Collapse>

		</div>
	);
}

export default Register;
