
# GraphQL

## Query

### Example Query

```graphql
{
  users{
    edges{
      node{
        id
        username
        groups{
          edges{
            node{
              id
              gid
              name
            }
          }
        }
      }
    }
  }
}
```

## Mutations

### Create User

```graphql
mutation createuser {
  createUser(username:"<USERNAME>", publicKey:"<USER_PUBLIC_KEY>"){
    user{
      username
      publicKey
    }
  }
}
```

### Create Group

```graphql
mutation creategroup {
  createGroup(name:"<NAME OF GROUP>", publicKey:"<GROUP_PUBLIC_KEY>", users:["<USERNAME>", "<USERNAME>", "<USERNAME>"]){
    group{
      name
    }
  }
}
```

### Create Message

```graphql
mutation createmessage {
  createMessage(group:"<GROUP GID>", content:"<JSON CONTENT>", sender:"<USERNAME>"){
    message{
      content
    }
  }
}
```
