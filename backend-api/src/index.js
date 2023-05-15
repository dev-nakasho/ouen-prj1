// index.js全文
const http = require("http");
// サーバ定義
const server = http.createServer();

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
const host = "localhost";

server.on("request", async (request, response) => {
  // /api/usersに対するAPI定義
  if (request.url === "/api/users") {
    const data = await client.query("select * from users");
    response.end(JSON.stringify(data.rows));
  } else {
    response.end("<p>this request is ohter.</p>");
  }
});

// サーバー起動
server.listen(port, host, () => {
  console.log(`server listen on http://${host}:${port}/`);
});
