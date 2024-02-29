"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    Booking.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        startDate: Sequelize.literal("CURRENT_DATE"),
        endDate: Sequelize.literal("CURRENT_DATE"),
      },
      {
        spotId: 2,
        userId: 1,
        startDate: Sequelize.literal("CURRENT_DATE"),
        endDate: Sequelize.literal("CURRENT_DATE"),
      },
      {
        spotId: 3,
        userId: 2,
        startDate: Sequelize.literal("CURRENT_DATE"),
        endDate: Sequelize.literal("CURRENT_DATE"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return await queryInterface.bulkDelete(options);
  },
};
