'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserTokens', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      encryptedPasswordResetToken: {
        type: Sequelize.STRING,
        unique: true,
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true,
      },
      facebookId: {
        type: Sequelize.STRING,
        unique: true,
      },
      linkedinId: {
        type: Sequelize.STRING,
        unique: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserTokens');
  }
};