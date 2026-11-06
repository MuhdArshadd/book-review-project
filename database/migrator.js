const path = require("path");
const { Umzug, SequelizeStorage } = require("umzug");
const { db } = require("../models");
const { logger } = require("../utils/logger");

const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js").replaceAll("\\", "/"),
    resolve: ({ name, path: migrationPath, context }) => {
      const migration = require(migrationPath);
      return {
        name,
        up: () => migration.up(context, db.Sequelize),
        down: () => migration.down(context, db.Sequelize),
      };
    },
  },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: {
    info: (message) => logger.info(message),
    warn: (message) => logger.warn(message),
    error: (message) => logger.error(message),
    debug: (message) => logger.debug(message),
  },
});

module.exports = { migrator };
