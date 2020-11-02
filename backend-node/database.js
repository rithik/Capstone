const Sequelize = require('sequelize');

const production = true; //process.env.PRODUCTION;

const db = production ? new Sequelize("postgres://vfukpcyiecobis:ab99b8c630954d38b3de8a57dac74b614245ee339799a51ca77f5ec1d230bb00@ec2-54-224-124-241.compute-1.amazonaws.com:5432/d6ta6ho824ru7j", {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
}) : new Sequelize('capstone', null, null, {
    dialect: 'sqlite',
    storage: './capstone.sqlite',
    logging: false
});

const UserModel = db.define('user', {
    username: {
        type: Sequelize.STRING
    },
    publicKey: {
        type: Sequelize.STRING
    },
    keys: {
        type: Sequelize.STRING
    }
});

const GroupModel = db.define('group', {
    name: {
        type: Sequelize.STRING
    },
    publicKey: {
        type: Sequelize.STRING
    },
});

const MessageModel = db.define('message', {
    content: {
        type: Sequelize.STRING
    },
    cType: {
        type: Sequelize.STRING
    }
});

const UserGroupModel = db.define('user_groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

UserModel.belongsToMany(GroupModel, {
    through: UserGroupModel
});
GroupModel.belongsToMany(UserModel, {
    through: UserGroupModel
});
MessageModel.belongsTo(GroupModel);
MessageModel.belongsTo(UserModel);

db.sync();

const User = db.models.user;
const Group = db.models.group;
const Message = db.models.message;
const UserGroup = db.models.user_groups;

module.exports = {
    User,
    Group,
    Message,
    UserGroup
};