module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'trx20PrivateKey', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Users', 'trx20PrivateKey');
  },
};
