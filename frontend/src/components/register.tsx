import React, {useState} from 'react';
import './../App.css';
import generateKeys from '../utils/generateKeys'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'


function Register() {
	const [myUsernameValue, setUsernameValue] = useState('') 
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
			<Button onClick={(e) => generateKeys(myUsernameValue, e)} variant="contained" color="primary">
			  Register
			</Button>
		</div>
	);
}

export default Register;
