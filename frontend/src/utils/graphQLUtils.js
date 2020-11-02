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

