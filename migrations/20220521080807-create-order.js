'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      managerId: {
        type: Sequelize.INTEGER,
        references: {model: 'Users'},
      },
      shopId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Shops'},
      },
      shopName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      managerFullName: {
        type: Sequelize.STRING,
      },
      clientFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tourDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['IN_PROCESSING', 'NEW', 'DELIVERY', 'CANCELED'],
        defaultValue: 'IN_PROCESSING',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {initialAutoIncrement: 1000000});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};