const { DataTypes } = require("sequelize");

const bookModel = (db) => {
  return db.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      BookName: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING(12000),
        allowNull: false,
      },
      BookImage: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      BookAuthor: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "books",
      timestamps: false,
      indexes: [
        {
          name: "books_title_author_unique",
          unique: true,
          fields: ["BookName", "BookAuthor"],
        },
      ],
    },
  );
};

module.exports = { bookModel };
