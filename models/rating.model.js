const { DataTypes } = require("sequelize");

const ratingModel = (db) => {
  return db.define(
    "Rating",
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      tableName: "rating",
      timestamps: false,
    },
  );
};

module.exports = { ratingModel };
