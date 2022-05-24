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
      hashedGoogleId: {
        type: Sequelize.STRING,
      },
      hashedFacebookId: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserTokens');
  }
};