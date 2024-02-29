"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "www.google.com",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com",
          preview: false,
        },
        {
          spotId: 3,
          url: "www.google.com",
          preview: false,
        },
        {
          spotId: 4,
          url: "www.google.com",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";

    return queryInterface.bulkDelete(options);
  },
};
