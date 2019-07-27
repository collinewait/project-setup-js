import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    let loggedInUser = await User.findOne({
      where: { username: login },
    });

    if (!loggedInUser) {
      loggedInUser = await User.findOne({
        where: { email: login },
      });
    }

    return loggedInUser;
  };

  User.beforeCreate(async instance => {
    const userInstance = instance;
    userInstance.password = await userInstance .generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function hashPassword() {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    return hashedPassword;
  };

  return User;
};

export default user;
