const { DataTypes } = require("sequelize");

const reviewModel = (db) => {
  return db.define(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING(12000),
        allowNull: false,
      },
    },
    {
      tableName: "review",
      timestamps: false,
    },
  );
};

module.exports = { reviewModel };
