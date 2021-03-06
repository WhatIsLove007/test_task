'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAddresses', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {model: 'Countries'},
      },
      city: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      additionalAddress: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAddresses');
  }
};