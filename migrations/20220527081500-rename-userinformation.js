'use strict';

module.exports = {

   async up(queryInterface, Sequelize) {
      await queryInterface.renameColumn('UserInformation', 'name', 'firstName');
      await queryInterface.renameColumn('UserInformation', 'surname', 'lastName');
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.renameColumn('UserInformation', 'firstName', 'name');
      await queryInterface.renameColumn('UserInformation', 'lastName', 'surname');
   }

};