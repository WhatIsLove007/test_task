'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Countries', [
      {
        name: 'Велика Британія',
        iso: 'GBR',
      },
      {
        name: 'Латвія',
        iso: 'LVA',
      },
      {
        name: 'Литва',
        iso: 'LTU',
      },
      {
        name: 'Молдова',
        iso: 'MDA',
      },
      {
        name: 'Німеччина',
        iso: 'DEU',
      },
      {
        name: 'Польща',
        iso: 'POL',
      },
      {
        name: 'Румунія',
        iso: 'ROU',
      },
      {
        name: 'США',
        iso: 'USA',
      },
      {
        name: 'Туреччина',
        iso: 'TUR',
      },
      {
        name: 'Україна',
        iso: 'UKR',
      },
      {
        name: 'Франція',
        iso: 'FRA',
      },
      {
        name: 'Італія',
        iso: 'ITA',
      },

    ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Countries', null, {});
  }
};