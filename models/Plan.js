const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Plan extends Model {
      static associate(models) {
        // Plan has many UserPlans (a plan can have multiple users subscribing to it)
        Plan.hasMany(models.UserPlan, {
          foreignKey: 'planId',
          onDelete: 'CASCADE', // Enables cascading delete
        });
      }
    }
    Plan.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        duration: {
          type: DataTypes.INTEGER, // Duration in days
          allowNull: false,
        },
        earn: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        dailyReward: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Plan",
        timestamps: true,
      }
    );
  
    return Plan;
};
