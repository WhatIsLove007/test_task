'use strict';

module.exports = {

   async up(queryInterface, Sequelize) {
      await queryInterface.renameColumn('Photocards', 'name', 'fileName');
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.renameColumn('Photocards', 'fileName', 'name');
   }

};