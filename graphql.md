# GraphQL

## Authentication

All queries and mutations will require you to be authenticated. The only mutation that does not require authorization is the `createUser` mutation.

In order to authenticate, you must create the jwt token by running the following mutation:

``` graphql
mutation{
  createToken(username:<USERNAME>, publicKey:<PUBLIC_KEY>){
    token
    username
  }
}
```

This token must be saved in the cookies so that the user can continue to make graphql calls to the server. 

## Query

### Example Query

``` graphql
  query{
    groupsByUser(username:"user4"){
      name
      id
      users
      publicKey
    }
  }

  query{
    allGroups{
      name
      id
      users
   }
  }

  query{
    user(username:"user5"){
      username
      id
    }
  }

query {
  messagesByGroup(gid:13, count:5, offset:2){
    id
    ts
    sender
    group
    content
  }
}
```

## Mutations

### Create User

``` graphql
mutation createUser{
  createUser(username:<USERNAME>, publicKey:<PUBLIC_KEY>){
    id
    username
    publicKey
  }
}
```

### Create Group

``` graphql
mutation createGroup{
  createGroup(name:<GROUP_NAME>, publicKey:<PUBLIC_KEY>, users:[<USERNAME>, <USERNAME>]){
    id
    name
    publicKey
    users
  }
}
```

### Create Message

``` graphql
mutation createMessage{
  createMessage(sender:<SENDER_USERNAME>, group:<GROUP_ID>, content:<CONTENT>){
    id
    content
    ts
  }
}
```

## Subscription - New Messages

``` graphql
subscription newMessages{
  newMessage{
    id
    content
  }
}
```
