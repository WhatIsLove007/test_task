'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Photocards', [
      {
        fileName: 'bar.jpg',
      },
      {
        fileName: 'bike.jpg',
      },
      {
        fileName: 'blue_water.jpg',
      },
      {
        fileName: 'cameras.jpg',
      },
      {
        fileName: 'leaf.jpg',
      },
      {
        fileName: 'mouse.jpg',
      },
      {
        fileName: 'rain.jpg',
      },
      {
        fileName: 'town.jpg',
      },
      {
        fileName: 'tropics.jpg',
      },
      {
        fileName: 'woman.jpg',
      },

    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Photocards', null, {});
  }
};