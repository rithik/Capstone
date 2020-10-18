const {
    createToken,
    verifyToken
} = require('./auth');

const {
    PubSub
} = require('apollo-server');

const {
    User,
    Group,
    Message,
    UserGroup
} = require('./database');

const Sequelize = require('sequelize');
const moment = require('moment');

const pubsub = new PubSub();
const Op = Sequelize.Op;

const resolvers = {
    Query: {
        async user(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const username = args.username;
            return await User.findOne({
                where: {
                    username
                }
            });
        },
        async allUsers(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const users = await User.findAll();
            return users.map(user => {
                return {
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    publicKey: user.dataValues.publicKey
                }
            })
        },
        async group(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const id = args.id;
            return await Group.findOne({
                where: {
                    id
                }
            });
        },
        async allGroups(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const groups = await Group.findAll();
            const all_groups = await getGroups(groups);
            return all_groups;
        },
        async groupsByUser(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const username = args.username;
            const user = await User.findOne({
                where: {
                    username
                }
            });
            const groups = await UserGroup.findAll({
                where: {
                    userId: user.dataValues.id
                }
            });
            const all_groups = await getGroupsForUser(groups);
            return all_groups;
        },
        async messagesByGroup(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const gid = args.gid;
            const params = {
                where: {
                    groupId: gid, 
                    createdAt: {
                        [Op.gt]: args.after ? new Date(Number(args.after)) : new Date(0),
                        [Op.lt]: args.before ? new Date(Number(args.before)) : new Date(),
                    }
                },
                offset: args.offset ? args.offset : 0,
                limit: args.count ? args.count : 10
            };
            const messages = await Message.findAll(params);
            return await messages.map(async message => {
                const user = await User.findOne({
                    where: {
                        id: message.dataValues.userId
                    }
                });
                return {
                    id: message.dataValues.id,
                    content: message.dataValues.content,
                    group: message.dataValues.groupId,
                    sender: user.dataValues.username,
                    ts: message.dataValues.createdAt
                }
            });
        },
    },
    Mutation: {
        createToken: async (root, args, context) => {
            const {
                username,
                publicKey
            } = args;
            return createToken(username, publicKey);
        },
        verifyToken: async (root, args, context) => {
            const {
                token
            } = args;
            return verifyToken(token);
        },
        async createUser(parent, args, context) {
            const newUser = {
                username: args.username,
                publicKey: args.publicKey,
            };
            const dbUser = User.build(newUser);
            await dbUser.save();
            return {
                id: dbUser.dataValues.id,
                username: dbUser.dataValues.username,
                publicKey: dbUser.dataValues.publicKey
            };
        },
        async createGroup(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const newGroup = {
                name: args.name,
                publicKey: args.publicKey,
            };
            const dbGroup = Group.build(newGroup);
            await dbGroup.save();
            const setupUsers = await addUserstoGroup(args.users, dbGroup.dataValues.id);
            return {
                id: dbGroup.dataValues.id,
                name: dbGroup.dataValues.name,
                publicKey: dbGroup.dataValues.publicKey,
                users: args.users,
            };
        },
        async createMessage(parent, args, context) {
            const {
                token
            } = context;
            const _ = verifyToken(token);
            const user = await User.findOne({
                where: {
                    username: args.sender
                }
            });
            const newMessage = {
                content: args.content,
                groupId: args.group,
                userId: user.dataValues.id,
            };
            const dbMessage = Message.build(newMessage);
            await dbMessage.save();
            const channel_name = `MESSAGE_GID_${args.group}`;
            pubsub.publish(channel_name, {
                newMessage
            });
            return {
                id: dbMessage.dataValues.id,
                content: dbMessage.dataValues.content,
                group: dbMessage.dataValues.groupId,
                sender: dbMessage.dataValues.userId,
                ts: dbMessage.dataValues.createdAt
            };
        },
    },
    Subscription: {
        newMessage: {
            subscribe: (parent, args, context, info) => pubsub.asyncIterator([`MESSAGE_GID_${args.gid}`])
        },
    },
};

const addUserstoGroup = async (usernames, groupId) => {
    return Promise.all(usernames.map(async username => {
        const groupMember = await User.findOne({
            where: {
                username
            }
        });
        const user = UserGroup.build({
            userId: groupMember.dataValues.id,
            groupId
        });
        await user.save();
        return groupMember.dataValues.id;
    }));
}

const getUsersById = async (users) => {
    return Promise.all(users.map(async user => {
        const userObj = await User.findOne({
            where: {
                id: user.dataValues.userId
            }
        });
        return userObj.dataValues.username;
    }));
}

const getGroups = async (group_ids) => {
    return Promise.all(group_ids.map(async group => {
        const users = await UserGroup.findAll({
            where: {
                groupId: group.dataValues.id
            }
        });
        const user_usernames = await getUsersById(users);
        return {
            id: group.dataValues.id,
            name: group.dataValues.name,
            publicKey: group.dataValues.publicKey,
            users: user_usernames
        }
    }));
}

const getGroupsForUser = async (group_ids) => {
    return Promise.all(group_ids.map(async group => {
        const users = await UserGroup.findAll({
            where: {
                groupId: group.dataValues.groupId
            }
        });
        const groupObj = await Group.findOne({
            where: {
                id: group.dataValues.groupId
            }
        })
        const user_usernames = await getUsersById(users);
        return {
            id: groupObj.dataValues.id,
            name: groupObj.dataValues.name,
            publicKey: groupObj.dataValues.publicKey,
            users: user_usernames
        }
    }));
}

module.exports = resolvers;

// https://www.apollographql.com/blog/tutorial-pagination-d1c3b3ee2823/