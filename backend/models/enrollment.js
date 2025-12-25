"use strict";

module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      enrollmentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Units",
          key: "unitId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      session: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "Enrollments",
      timestamps: true,
    }
  );

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.User, { foreignKey: "studentId", as: "User" });
    Enrollment.belongsTo(models.Unit, { foreignKey: "unitId", as: "Unit" });
  };

  return Enrollment;
};
