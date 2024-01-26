require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, 
    {
        dialect: 'mysql',
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306,
            logging: console.log,
        }
    );
}

sequelize.authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.");
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;