'use strict';

const {USER_STATUSES, USER_ROLES} = require('../config/const.js');


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      passwordHash: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: [USER_STATUSES.ACTIVE, USER_STATUSES.BANNED],
        defaultValue: USER_STATUSES.ACTIVE,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: [USER_ROLES.CLIENT, USER_ROLES.MANAGER],
        defaultValue: USER_ROLES.CLIENT,
        allowNull: false,
      },
      shopId: {
        type: Sequelize.INTEGER,
        references: {model: 'Shops'},
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};