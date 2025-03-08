const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Phone number cannot be empty',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },
      withdrawPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Withdraw password cannot be empty',
          },
        },
      },
      invitationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      },
      referrerId: {
        type: DataTypes.INTEGER, // Stores the ID of the user who referred this user
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'), // Define ENUM type for role
        allowNull: false,
        defaultValue: 'user', // Default role is 'user'
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true, // Enables "soft delete" functionality with deletedAt
    }
  );

  return User;
};
