'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'uid', {
      type: Sequelize.STRING(8),
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'uid');
    await queryInterface.removeColumn('Users', 'firstName');
    await queryInterface.removeColumn('Users', 'lastName');
  },
};
