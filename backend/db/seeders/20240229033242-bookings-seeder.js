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
        startDate: new Date("2024-04-15 08:00:00"),
        endDate: new Date("2024-04-18 08:00:00"),
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date("2024-04-18 08:00:00"),
        endDate: new Date("2024-04-20 08:00:00"),
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date("2024-04-21 08:00:00"),
        endDate: new Date("2024-04-23 08:00:00"),
      },
      {
        spotId: 4,
        userId: 2,
        startDate: new Date("2024-04-24 08:00:00"),
        endDate: new Date("2024-04-26 08:00:00"),
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date("2024-04-26 08:00:00"),
        endDate: new Date("2024-04-27 08:00:00"),
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date("2024-04-28 08:00:00"),
        endDate: new Date("2024-04-30 08:00:00"),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return await queryInterface.bulkDelete(options);
  },
};
