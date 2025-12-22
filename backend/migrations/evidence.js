"use strict";

const unit = require("./unit");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Evidence", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      unitCode: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Units",
          key: "unitCode",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      originalname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Evidence");
  },
};
