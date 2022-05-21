'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserPreferences', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserPreferences');
  }
};