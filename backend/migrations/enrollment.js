"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Enrollments", {
      enrollmentId: {
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

      session: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Enrollments");
  },
};
