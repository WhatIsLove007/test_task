'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Shops', [
      {
        name: 'Anteey Shop',
        createdAt: new Date()
      },
      {
        name: 'G&Q',
        createdAt: new Date()
      },
      {
        name: 'Dolphins',
        createdAt: new Date()
      },
      {
        name: 'Unique Kyiv',
        createdAt: new Date()
      },
      {
        name: 'Reel',
        createdAt: new Date()
      },

    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shops', null, {});
  }
};