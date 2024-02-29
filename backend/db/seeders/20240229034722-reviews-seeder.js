"use strict";

const { Review } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "Amazing",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Wonderful",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: "Terrible",
        stars: 1,
      },
      {
        spotId: 3,
        userId: 1,
        review: "Okay",
        stars: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
