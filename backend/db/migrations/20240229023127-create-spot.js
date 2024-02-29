"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: { model: "Users" },
          onDelete: "CASCADE",
          hooks: true,
        },
        address: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING(50),
        },
        state: {
          allowNull: false,
          type: Sequelize.STRING(2),
        },
        country: {
          allowNull: false,
          type: Sequelize.STRING(50),
        },
        lat: {
          allowNull: false,
          type: Sequelize.DECIMAL(3, 5),
        },
        lng: {
          allowNull: false,
          type: Sequelize.DECIMAL(3, 5),
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(100),
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING(255),
        },
        price: {
          allowNull: false,
          type: Sequelize.DECIMAL(6, 2),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  },
};
