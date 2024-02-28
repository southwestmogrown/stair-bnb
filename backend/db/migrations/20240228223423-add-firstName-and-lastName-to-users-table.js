"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "firstName", {
      type: Sequelize.STRING(30),
      defaultValue: "",
    });

    await queryInterface.addColumn("Users", "lastName", {
      type: Sequelize.STRING(100),
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "firstName");
    await queryInterface.removeColumn("Users", "lastName");
  },
};
