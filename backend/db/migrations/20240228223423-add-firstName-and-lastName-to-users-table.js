"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("User", "firstName", {
      type: Sequelize.STRING(30),
      defaultValue: "",
    });

    await queryInterface.addColumn("User", "lastName", {
      type: Sequelize.STRING(100),
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.removeColumn("User", "firstName");
    await queryInterface.removeColumn("User", "lastName");
  },
};
