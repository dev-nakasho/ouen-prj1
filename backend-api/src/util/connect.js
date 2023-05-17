// DB接続
const { Client } = require("pg");
const client = new Client({
  user: "dbuser1",
  password: "dbuser1",
  host: "localhost",
  database: "testdb",
  port: 5432,
});
client.connect();

module.exports = client;
