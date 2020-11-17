const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
} = require('apollo-server-express');

const {
    User,
    Group,
    Message,
    UserGroup
} = require('./database');

const createToken = async (username, publicKey) => {
    try {
        const userCount = await User.count({where: {username, publicKey}});
        if (userCount === 0){
            throw Error("username and public key are incorrect")
        }
        const token = jwt.sign({ username, publicKey }, "supersecret");
        return { token, username }
    } catch (e) {
        throw new AuthenticationError(
            'Username and Public Key combination is incorrect.',
        )
    }
}

const verifyToken = (token) => {
    try {
        const { username } = jwt.verify(token, "supersecret");
        return { username, token };
    } catch (e) {
        throw new AuthenticationError(
            'Authentication token is invalid, please log in',
        );
    }
}

module.exports = {createToken, verifyToken};
