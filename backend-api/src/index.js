// express初期化
const express = require("express");
const app = express();

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

const port = 3000;
const host = "127.0.0.1";

app.get("/api/users", async (request, response) => {
  const data = await client.query("select * from users");
  response.end(JSON.stringify(data.rows));
});

// サーバー起動
app.listen(port, host, () => {
  console.log(`server listen on http://${host}:${port}/`);
});
