import { sequelize } from "../models";

sequelize.drop({cascade: true})
   .then(() => sequelize.query('DROP TABLE IF EXISTS SequelizeData;'))
   .then(() => sequelize.query('DROP TABLE IF EXISTS SequelizeMeta;'))
   .then(() => process.exit(0))