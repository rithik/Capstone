import React, { useState } from 'react';
import './../App.css';
import { generateKeys, generatePasswordHash } from '../utils/generateKeys'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { gql, useMutation, useQuery } from '@apollo/client';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {encryptLocalStorage, setLocalStorage} from '../utils/localStorageKeyGen';

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
			keys
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

// register the user
function Register() {
	const [updateKeys] = useMutation(UPDATE_KEYS);
	const [createUser] = useMutation(CREATE_USER);
	const [createToken] = useMutation(CREATE_TOKEN, {
		onCompleted({ createToken }) {
			const password = tab === 'login' ? loginPassword : registerPassword;
			localStorage.setItem('token', createToken.token);
			localStorage.setItem('username', createToken.username);
			localStorage.setItem('password', generatePasswordHash(password));
			updateKeys({variables: {username: createToken.username, keys: encryptLocalStorage()}});
			window.location.href = window.location.href + '/main';
		}
	});

	const [createLoginToken] = useMutation(CREATE_TOKEN, {
		onCompleted({ createToken }) {
			localStorage.setItem('token', createToken.token);
			window.location.href = window.location.href + 'main';
		}
	});

	const [registerUsername, setRegisterUsername] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');

	const [loginUsername, setLoginUsername] = useState('');
	const [loginPassword, setLoginPassword] = useState('');

	const [registerUsernameError, setRegisterUsernameError] = useState(false);
	const [loginError, setLoginError] = useState(false);

	const [tab, setTab] = useState('login');

	const { loading, error, data } = useQuery(GET_USER, {
		variables: { username: tab === 'login' ? loginUsername : registerUsername },
	});

	function setKeys(myUsernameValue) {
		const username = tab === 'login' ? loginUsername : registerUsername;
		const x = Promise.resolve(generateKeys(myUsernameValue)).then(function (array) {
			const publicKey = array.publicKey
			const privateKey = array.privateKey
			createUser({ variables: { username, publicKey } });
			localStorage.setItem('user-publicKey', publicKey);
			localStorage.setItem('user-privateKey', privateKey);
			createToken({ variables: { username, publicKey } });
		});
	}

	const registerUser = () => {
		if (error) {
			console.log('error in username, still setting new user')
			setKeys(registerUsername);
		}
		else {
			console.log(data)
			if (data.user === null) {
				console.log('username is valid, creating new set of keys')
				setRegisterUsernameError(false)
				setKeys(registerUsername);
			}
			else {
				console.log('username exists')
				setRegisterUsernameError(true)
			}
		}
	}

	const loginUser = () => {
		if (error) {
			console.log(error);
			setLoginError(true);
		}
		else {
			console.log(data)
			if (data.user === null) {
				console.log('username is valid, creating new set of keys')
				setLoginError(true)
			}
			else {
				console.log('username exists')
				console.log(data.user);
				const hashedPassword = generatePasswordHash(loginPassword);
				console.log(hashedPassword);
				const success = setLocalStorage(data.user.keys, hashedPassword);
				if (success){
					const username = localStorage.getItem('username');
					const publicKey = localStorage.getItem('user-publicKey');
					createLoginToken({ variables: { username, publicKey } });
				}
				else{
					setLoginError(true);
				}
			}
		}
	}

	return (
		<Tabs fill={true}
			id="controlled-tab-example"
			className="tabHeadings"
			activeKey={tab}
			onSelect={(k) => setTab(k)}
		>
			<Tab eventKey="login" title="Login">
				<div className="register">
					<TextField
						InputProps={{
							style: { color: "black" },
						}}
						id="outlined-basic" label="Username"
						variant="outlined"
						value={loginUsername}
						color={'secondary'}
						fullWidth={true}
						onChange={(e) => setLoginUsername(e.target.value)}
					/>
					<br />
					<br />
					<TextField
						InputProps={{
							style: { color: "black" },
						}}
						id="outlined-basic" label="Password"
						variant="outlined"
						value={loginPassword}
						type="password"
						color={'secondary'}
						fullWidth={true}
						onChange={(e) => setLoginPassword(e.target.value)}
					/>
					<br />
					<br />
					<Button onClick={(e) => {
						e.preventDefault();
						loginUser()
					}} variant="contained" color="secondary">
						Login
			</Button>
					<br />
					<br />
					<Collapse in={loginError}>
						<Alert
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setLoginError(false);
									}}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
							variant="filled" severity="error"
						>
							Invalid Login
				</Alert>
					</Collapse>

				</div>
			</Tab>
			<Tab eventKey="register" title="Register">
				<div className="register">
					<TextField
						InputProps={{
							style: { color: "black" },
						}}
						id="outlined-basic" label="Username"
						variant="outlined"
						value={registerUsername}
						color={'secondary'}
						fullWidth={true}
						onChange={(e) => setRegisterUsername(e.target.value)}
					/>
					<br />
					<br />
					<TextField
						InputProps={{
							style: { color: "black" },
						}}
						id="outlined-basic" label="Password"
						variant="outlined"
						value={registerPassword}
						type="password"
						color={'secondary'}
						fullWidth={true}
						onChange={(e) => setRegisterPassword(e.target.value)}
					/>
					<br />
					<br />
					<Button onClick={(e) => {
						e.preventDefault();
						registerUser();
					}} variant="contained" color="secondary">
						Register
			</Button>
					<br />
					<br />
					<Collapse in={registerUsernameError}>
						<Alert
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										setRegisterUsernameError(false);
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
			</Tab>
		</Tabs>
	);
}

export default Register;
