'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'earn' column from the 'Plans' table
    await queryInterface.removeColumn('Plans', 'earn');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the 'earn' column back if we need to revert
    await queryInterface.addColumn('Plans', 'earn', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  }
};
