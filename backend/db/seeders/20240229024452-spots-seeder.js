"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Spot } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "123 456th St",
          city: "Parts Unknown",
          state: "AZ",
          country: "United States of America",
          lat: 133.4356,
          lng: 90.545,
          name: "Beautiful Vista",
          description: "You'll just love it!",
          price: 145.0,
        },
        {
          ownerId: 2,
          address: "6934 Cool St",
          city: "Chicago",
          state: "IL",
          country: "United States of America",
          lat: 64.44,
          lng: 120.542,
          name: "Miracle Mile",
          description: "Tubular!",
          price: 199.99,
        },
        {
          ownerId: 3,
          address: "12 E. West St",
          city: "Stockton",
          state: "CA",
          country: "United States of America",
          lat: 136.0,
          lng: 74.45,
          name: "Boneyard",
          description: "Danger, Will Robinson",
          price: 15.0,
        },
        {
          ownerId: 1,
          address: "123 456th Ave",
          city: "Flagstaff",
          state: "AZ",
          country: "United States of America",
          lat: 133.03,
          lng: 180.232,
          name: "Mountain",
          description: "What a climb!",
          price: 3.5,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return await queryInterface.bulkDelete(options);
  },
};
