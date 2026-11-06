const toBookResponse = (book) => ({
  id: book.id,
  title: book.BookName,
  author: book.BookAuthor,
  imageUrl: book.BookImage,
  description: book.Description,
  averageRating:
    book.dataValues?.averageRating === null || book.dataValues?.averageRating === undefined
      ? null
      : Number(book.dataValues.averageRating),
});

const toReviewResponse = (review) => ({
  id: review.id,
  bookId: review.bookId,
  review: review.review,
});

const toRatingResponse = (rating, averageRating) => ({
  id: rating.id,
  bookId: rating.bookId,
  rating: rating.rating,
  averageRating: Number(averageRating),
});

module.exports = { toBookResponse, toReviewResponse, toRatingResponse };
