"use strict";

module.exports = (sequelize, DataTypes) => {
  const Evidence = sequelize.define(
    "Evidence",
    {
      evidenceId: {
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
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      evidenceType: {
        type: DataTypes.STRING,
        //field: 'evidence_type', // <--- Add this if your DB uses snake_case
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "Evidence",
      timestamps: false,
    }
  );

  Evidence.associate = (models) => {
    Evidence.belongsTo(models.User, { foreignKey: "studentId", as: "User" });
    Evidence.belongsTo(models.Unit, { foreignKey: "unitId", as: "Unit" });
  };

  return Evidence;
};
