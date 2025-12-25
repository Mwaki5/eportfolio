"use strict";

module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define(
    "Unit",
    {
      unitId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      unitCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      unitName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      tableName: "Units",
      timestamps: true,
    }
  );

  Unit.associate = (models) => {
    Unit.belongsTo(models.User, { foreignKey: "staffId", as: "Staff" });
    Unit.hasMany(models.Marks, { foreignKey: "unitId" });
    Unit.hasMany(models.Enrollment, { foreignKey: "unitId" });
  };

  return Unit;
};
