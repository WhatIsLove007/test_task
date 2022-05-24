'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserInformation', {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {model: 'Users'},
        onDelete: 'cascade',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['MALE', 'FEMALE'],
      },
      birthdate: {
        type: Sequelize.DATE,
      },
      about: {
        type: Sequelize.TEXT,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      profileHeader: {
        type: Sequelize.STRING,
      },
      desiredVacationFrom: {
        type: Sequelize.DATE,
      },
      desiredVacationUntil: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserInformation');
  }
};