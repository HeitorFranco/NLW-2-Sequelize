const Sequelize = require("sequelize").Sequelize

const sequelize = new Sequelize('bu1hsnp9vfrxpwzexbk3', 'uuqu04unl9lsamlz', 'D7gxCJFGuuv8SZfWucyQ', {
    host: 'bu1hsnp9vfrxpwzexbk3-mysql.services.clever-cloud.com',
    dialect: 'mysql'
});
async function testConection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConection()

module.exports = sequelize