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
      country: {
        type: Sequelize.ENUM,
        values: [
          'GREAT_BRITAIN',
          'LATVIA',
          'LITHUANIA',
          'MOLDOVA',
          'GERMANY',
          'POLAND',
          'ROMANIA',
          'USA',
          'TURKEY',
          'UKRAINE',
          'FRANCE',
        ],
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      index: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
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