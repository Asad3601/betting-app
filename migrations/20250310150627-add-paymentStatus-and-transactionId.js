"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("UserPlans", "paymentStatus", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("UserPlans", "paymentTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("UserPlans", "paymentDate", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("UserPlans", "paymentDate");
    await queryInterface.removeColumn("UserPlans", "paymentTransactionId");
    await queryInterface.removeColumn("UserPlans", "paymentStatus");
  },
};
