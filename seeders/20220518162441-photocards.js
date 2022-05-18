'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Photocards', [
      {
        name: 'bar.jpg',
      },
      {
        name: 'bike.jpg',
      },
      {
        name: 'blue_water.jpg',
      },
      {
        name: 'cameras.jpg',
      },
      {
        name: 'leaf.jpg',
      },
      {
        name: 'mouse.jpg',
      },
      {
        name: 'rain.jpg',
      },
      {
        name: 'town.jpg',
      },
      {
        name: 'tropics.jpg',
      },
      {
        name: 'woman.jpg',
      },

    ], {});

  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Photocards', null, {});
  }
};