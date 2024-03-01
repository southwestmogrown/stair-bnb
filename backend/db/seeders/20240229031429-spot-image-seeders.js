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
          preview: true,
        },
        {
          spotId: 1,
          url: "www.google.com/1",
          preview: false,
        },
        {
          spotId: 1,
          url: "www.google.com/2",
          preview: false,
        },
        {
          spotId: 1,
          url: "www.google.com/3",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com",
          preview: true,
        },
        {
          spotId: 2,
          url: "www.google.com/1",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/2",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/3",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/4",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/5",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/6",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/7",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/8",
          preview: false,
        },
        {
          spotId: 2,
          url: "www.google.com/9",
          preview: false,
        },
        {
          spotId: 3,
          url: "www.google.com",
          preview: true,
        },
        {
          spotId: 3,
          url: "www.google.com/1",
          preview: false,
        },
        {
          spotId: 3,
          url: "www.google.com/2",
          preview: false,
        },
        {
          spotId: 3,
          url: "www.google.com/3",
          preview: false,
        },
        {
          spotId: 4,
          url: "www.google.com",
          preview: true,
        },
        {
          spotId: 4,
          url: "www.google.com/1",
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
