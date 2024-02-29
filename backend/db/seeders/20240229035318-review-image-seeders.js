"use strict";
/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "www.google.com",
      },
      {
        reviewId: 2,
        url: "www.google.com",
      },
      {
        reviewId: 3,
        url: "www.google.com",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.table = "ReviewImages";
    return await queryInterface.bulkDelete(options);
  },
};
