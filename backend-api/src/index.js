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
const host = "localhost"; // 127.0.0.1

// リクエストボディからデータ取得を許可
app.use(express.urlencoded({ extended: true }));

// 一覧取得
app.get("/api/products", async (request, response) => {
  const data = await client.query("select * from products");
  response.end(JSON.stringify(data.rows));
});

// 個別取得
app.get("/api/products/:id", async (request, response) => {
  const data = await client.query(
    `select * from products where id = ${request.params.id}`
  );
  response.end(JSON.stringify(data.rows));
});

// 登録
app.post("/api/products", async (request, response) => {
  await client.query(
    `insert into products (name, price) values ('${request.body.name}', '${request.body.price}')`
  );
  const data = await client.query(
    "select * from products where id = (select max(id) from products)"
  );
  response.end(JSON.stringify(data.rows));
});

// 更新
app.put("/api/products/:id", async (request, response) => {
  await client.query(
    `update products set
      price = ${request.body.price}
      where id = ${request.params.id}
    `
  );
  const data = await client.query(
    `select * from products where id = ${request.params.id}`
  );
  response.end(JSON.stringify(data.rows));
});

// 削除
app.delete("/api/products/:id", async (request, response) => {
  await client.query(`delete from products where id = ${request.params.id}`);
  const data = await client.query("select * from products order by id");
  response.end(JSON.stringify(data.rows));
});

// サーバー起動
app.listen(port, host, () => {
  console.log(`server listen on http://${host}:${port}/`);
});
