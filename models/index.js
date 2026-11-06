const { Sequelize } = require("sequelize");
const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_SSL,
} = require("../config/env.config");
const { bookModel } = require("./book.model");
const { ratingModel } = require("./rating.model");
const { reviewModel } = require("./review.model");

const sharedOptions = {
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: DB_SSL
    ? {
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
      }
    : {},
};

const db = DATABASE_URL
  ? new Sequelize(DATABASE_URL, sharedOptions)
  : new Sequelize({
      ...sharedOptions,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      username: DB_USERNAME,
      password: DB_PASSWORD,
    });

const Book = bookModel(db);
const Rating = ratingModel(db);
const Review = reviewModel(db);

Book.hasMany(Rating, { foreignKey: "bookId", onDelete: "CASCADE" });
Rating.belongsTo(Book, { foreignKey: "bookId" });

Book.hasMany(Review, { foreignKey: "bookId", onDelete: "CASCADE" });
Review.belongsTo(Book, { foreignKey: "bookId" });

module.exports = { db, Book, Rating, Review };
