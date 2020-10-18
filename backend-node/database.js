const Sequelize = require('sequelize');

const db = new Sequelize('capstone', null, null, {
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
});

const UserGroupModel = db.define('user_groups', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  });

UserModel.belongsToMany(GroupModel, { through: UserGroupModel });
GroupModel.belongsToMany(UserModel, { through: UserGroupModel });
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