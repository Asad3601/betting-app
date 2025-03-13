'use strict';
const { DataTypes, Model } = require("sequelize");
const Plan = require("./Plan");

module.exports = (sequelize) => {
  class UserPlan extends Model {
    static associate(models) {
      // Many-to-many relationship between Product and Category
      // Product model
      UserPlan.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',  // ✅ Enables cascading delete
      });

      UserPlan.belongsTo(models.Plan, {
        foreignKey: 'planId',
        onDelete: 'CASCADE',
      });
    }
  }

  UserPlan.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      planId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Plans",
          key: "id",
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // New field to track the payment status
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // default to pending if no status is set
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,  // Can be null if not yet paid
      },
      paymentTransactionId: {
        type: DataTypes.STRING,
        allowNull: true, // Store the transaction ID from PayPal
      },
    },
    {
      sequelize,
      modelName: "UserPlan",
      timestamps: true,
    }
  );

  return UserPlan;
};
