const { db, Book, Rating, Review } = require("../models");
const { demoBooks } = require("./seed-data");

const resetDemoData = async () => {
  return db.transaction(async (transaction) => {
    await Review.destroy({ where: {}, transaction });
    await Rating.destroy({ where: {}, transaction });
    await Book.destroy({ where: {}, transaction });

    for (const item of demoBooks) {
      const book = await Book.create(
        {
          BookName: item.title,
          BookAuthor: item.author,
          BookImage: item.imageUrl,
          Description: item.description,
        },
        { transaction },
      );

      await Rating.bulkCreate(
        item.ratings.map((rating) => ({ bookId: book.id, rating })),
        { transaction },
      );
      await Review.bulkCreate(
        item.reviews.map((review) => ({ bookId: book.id, review })),
        { transaction },
      );
    }
  });
};

module.exports = { resetDemoData };
