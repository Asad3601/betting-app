module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Users', 'trx20DepositAddress', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Users', 'trx20DepositAddress');
  },
};
