const normalizeTableNames = (tables) => {
  return tables.map((table) => {
    if (typeof table === "string") return table.toLowerCase();
    return String(table.tableName || table.name || table).toLowerCase();
  });
};

const up = async (queryInterface, Sequelize) => {
  const tables = normalizeTableNames(await queryInterface.showAllTables());

  if (!tables.includes("books")) {
    await queryInterface.createTable("books", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      BookName: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      Description: {
        type: Sequelize.STRING(12000),
        allowNull: false,
      },
      BookImage: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      BookAuthor: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    });
  }

  const bookIndexes = await queryInterface.showIndex("books");
  if (!bookIndexes.some((index) => index.name === "books_title_author_unique")) {
    await queryInterface.addIndex("books", ["BookName", "BookAuthor"], {
      name: "books_title_author_unique",
      unique: true,
    });
  }

  if (!tables.includes("rating")) {
    await queryInterface.createTable("rating", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "books", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  }

  if (!tables.includes("review")) {
    await queryInterface.createTable("review", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "books", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      review: {
        type: Sequelize.STRING(12000),
        allowNull: false,
      },
    });
  }
};

const down = async (queryInterface) => {
  await queryInterface.dropTable("review");
  await queryInterface.dropTable("rating");
  await queryInterface.dropTable("books");
};

module.exports = { up, down };
