"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Plans", "earn", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn("Plans", "dailyReward", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Plans", "earn");
    await queryInterface.removeColumn("Plans", "dailyReward");
  },
};
