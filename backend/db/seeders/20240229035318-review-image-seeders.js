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
        url: "www.google.com/4",
      },
      {
        reviewId: 3,
        url: "www.google.com/45",
      },
      {
        reviewId: 1,
        url: "www.google.com/12",
      },
      {
        reviewId: 2,
        url: "www.google.com/56",
      },
      {
        reviewId: 3,
        url: "www.google.com/42",
      },
      {
        reviewId: 1,
        url: "www.google.com/75",
      },
      {
        reviewId: 2,
        url: "www.google.com/86",
      },
      {
        reviewId: 3,
        url: "www.google.com/99",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.table = "ReviewImages";
    return await queryInterface.bulkDelete(options);
  },
};
