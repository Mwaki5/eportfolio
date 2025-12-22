"use strict";

module.exports = (sequelize, DataTypes) => {
  const Evidence = sequelize.define(
    "Evidence",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      unitCode: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Units",
          key: "unitCode",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evidenceType: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
        defaultValue: "image",
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
    Evidence.belongsTo(models.Unit, { foreignKey: "unitCode", as: "Unit" });
  };

  return Evidence;
};
