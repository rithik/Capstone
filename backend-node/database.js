const Sequelize = require('sequelize');

const production = process.env.PRODUCTION;

const db = production ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
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