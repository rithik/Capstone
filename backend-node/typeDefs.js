const {
    gql
} = require('apollo-server-express');

const typeDefs = gql `
    type AuthPayLoad {
        token: String!
        username: String!
    }

    type User {
        id: Int!
        username: String!
        publicKey: String!
    }

    type Group {
        id: Int!
        users: [UserOut!]
        name: String!
        publicKey: String!
    }
    
    type GroupOut {
        id: Int!
        users: [UserOut!]
        name: String!
        publicKey: String!
    }
    

    type Message {
        id: Int!
        content: String!
        group: ID!
        sender: ID!
        ts: String!
        cType: String!  
    }

    type MessageOut {
        count: Int
        messages: [Message]
    }

    type UserOut {
        username: String!
        publicKey: String!
    }

    type Query {
        allUsers: [User]
        user(username: String!): User
        allGroups: [Group]
        group(id: Int!): Group
        groupsByUser(username: String!): [Group]
        messagesByGroup(gid: Int!, after: String, before: String, count: Int, offset: Int): [Message]
    }

    type Mutation { 
        createToken(username: String!, publicKey: String!) : AuthPayLoad!
        verifyToken(token: String!): AuthPayLoad!    
        createUser(
            username: String!, 
            publicKey: String!,
        ): User
        createGroup(
            name: String!
            users: [String!], 
            publicKey: String!,
        ): GroupOut
        createMessage( 
            content: String!
            group: Int!, 
            sender: String!,
            cType: String!
        ): Message
    }

    type Subscription {
        newMessage(gid: Int!): Message
        newGroup(username: String!): GroupOut
    }
`;

module.exports = typeDefs;
