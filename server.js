// server.js
const app = require('./app');
const main = require('./database/index');

const port = process.env.PORT || 3000;

main().catch(err => console.log("Error connecting to database:", err));

const server = app.listen(port, () => {
    console.log("Web service server running on port:", port);
});

module.exports = server;
