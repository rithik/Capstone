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
import { encryptLocalStorage, setLocalStorage } from '../utils/localStorageKeyGen';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const customTheme = createMuiTheme({
	overrides: {
		MuiFormLabel: { root: { color: 'white', borderColor: 'white' } },
		MuiOutlinedInput: {
			root: {
				'& $notchedOutline': {
					borderColor: 'rgba(255, 255, 255, 0.23)',
				},
				'&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
					borderColor: '#4A90E2',
					'@media (hover: none)': {
						borderColor: 'rgba(255, 255, 255, 0.23)',
					},
				},
				'&$focused $notchedOutline': {
					borderColor: '#4A90E2',
					borderWidth: 1,
				},
			}
		},
		MuiInput: {
			input: {
				"&::placeholder": {
					color: "gray"
				},
				color: "white", // if you also want to change the color of the input, this is the prop you'd use
			}
		}
	}
});


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
	const [createUser] = useMutation(CREATE_USER, {
		onCompleted({ createUser }) {
			const username = createUser.username;
			const publicKey = createUser.publicKey;
			createToken({ variables: { username, publicKey } });
		}
	});
	const [createToken] = useMutation(CREATE_TOKEN, {
		onCompleted({ createToken }) {
			const password = tab === 'login' ? loginPassword : registerPassword;
			localStorage.setItem('token', createToken.token);
			localStorage.setItem('username', createToken.username);
			localStorage.setItem('password', generatePasswordHash(password));
			updateKeys({ variables: { username: createToken.username, keys: encryptLocalStorage() } });
			window.location.href = window.location.href + 'main';
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

	const [buttonPressed, setButtonPressed] = useState(false);

	const [tab, setTab] = useState('login');

	const { error, refetch } = useQuery(GET_USER, {
		variables: { username: tab === 'login' ? loginUsername : registerUsername },
	});

	const setKeys = async (myUsernameValue) => {
		const username = tab === 'login' ? loginUsername : registerUsername;
		Promise.resolve(generateKeys(myUsernameValue, 4096)).then(function (array) {
			const publicKey = array.publicKey
			const privateKey = array.privateKey
			createUser({ variables: { username, publicKey } });
			localStorage.setItem('user-publicKey', publicKey);
			localStorage.setItem('user-privateKey', privateKey);
			localStorage.setItem('username', username);
		});
	}

	const registerUser = async () => {
		const { data: userData } = await refetch({ username: registerUsername });
		if (error) {
			setKeys(registerUsername);
		}
		else {
			if (userData.user == null) {
				setRegisterUsernameError(false);
				setKeys(registerUsername);
			}
			else {
				setRegisterUsernameError(true);
				setButtonPressed(false);
			}
		}
	}

	const loginUser = async () => {
		const { data: userData } = await refetch({ username: loginUsername });
		console.log(userData);
		if (error) {
			console.error(error);
			setLoginError(true);
			setButtonPressed(false);
		}
		else {
			if (userData.user === null) {
				setLoginError(true);
				setButtonPressed(false);
			}
			else {
				const hashedPassword = generatePasswordHash(loginPassword);
				const success = setLocalStorage(userData.user.keys, hashedPassword);
				if (success) {
					const username = localStorage.getItem('username');
					const publicKey = localStorage.getItem('user-publicKey');
					createLoginToken({ variables: { username, publicKey } });
				}
				else {
					setLoginError(true);
					setButtonPressed(false);
				}
			}
		}
	}

	return (
		<ThemeProvider theme={customTheme}>
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
								style: { color: "white" },
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
								style: { color: "white" },
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
						<Button disabled={buttonPressed} onClick={(e) => {
							e.preventDefault();
							setButtonPressed(true);
							loginUser()
						}} variant="contained" color="secondary">
							{buttonPressed && <CircularProgress
								size={20}
								style={{ color: 'white', marginRight: '10px' }}
							/>} Login
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
								style: { color: "white" },
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
								style: { color: "white" },
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
						<Button disabled={buttonPressed} onClick={(e) => {
							e.preventDefault();
							setButtonPressed(true);
							registerUser();
						}} variant="contained" color="secondary">
							{buttonPressed && <CircularProgress
								size={20}
								style={{ color: 'white', marginRight: '10px' }}
							/>} Register
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
		</ThemeProvider>
	);
}

export default Register;
