'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FavoritePhotocards', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      photocardId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Photocards'},
        onDelete: 'cascade',
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FavoritePhotocards');
  }
};