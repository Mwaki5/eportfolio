"use strict";

const unit = require("./unit");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Evidence", {
      evidenceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      unitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "unitId",
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
      evidenceType: {
        type: Sequelize.STRING,
        //field: 'evidence_type', // <--- Add this if your DB uses snake_case
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Evidence");
  },
};
