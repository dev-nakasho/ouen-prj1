const router = require("express").Router();
const client = require("../util/connect");

// 一覧取得
router.get("/", async (request, response) => {
  const data = await client.query("select * from products");
  response.end(JSON.stringify(data.rows));
});

// 個別取得
router.get("/:id", async (request, response) => {
  const data = await client.query(
    `select * from products where id = ${request.params.id}`
  );
  response.end(JSON.stringify(data.rows));
});

// 登録
router.post("/", async (request, response) => {
  await client.query(
    `insert into products (name, price) values ('${request.body.name}', '${request.body.price}')`
  );
  const data = await client.query(
    "select * from products where id = (select max(id) from products)"
  );
  response.end(JSON.stringify(data.rows));
});

// 更新
router.put("/:id", async (request, response) => {
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
router.delete("/:id", async (request, response) => {
  await client.query(`delete from products where id = ${request.params.id}`);
  const data = await client.query("select * from products order by id");
  response.end(JSON.stringify(data.rows));
});

module.exports = router;
