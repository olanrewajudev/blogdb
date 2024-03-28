const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../Config/dbConfig");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: true,

    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.acquire,
        idle: dbConfig.idle,
    }
}
)

sequelize.authenticate()
    .then(() => console.log(`server connected`))
    .catch((error) => console.log(`server error ${error}`))

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

//register all models
db.users = require('./userModel')(sequelize, DataTypes)

db.sequelize.sync({ force: true }).then(() => console.log('re-sync done successfully.'));










module.exports = db;