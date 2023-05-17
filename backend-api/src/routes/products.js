const router = require("express").Router();
const client = require("../util/connect");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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
router.post(
  "/",
  body("name")
    .isString()
    .notEmpty()
    .withMessage("商品名を正しく入力してください。"),
  body("price").isNumeric().withMessage("価格を正しく入力してください。"),
  async (request, response) => {
    const { name, price } = request.body;
    // バリデーション
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    // 重複確認
    const isExist = await client.query(
      `select * from products where name = '${name}'`
    );
    if (isExist.rows.length !== 0) {
      return response
        .status(400)
        .json({ message: "すでに登録済みの商品です。" });
    }
    // ハッシュ化
    const saltRounds = 10;
    const hashProductCode = await bcrypt.hash(name, saltRounds);

    // 商品登録
    await client.query(
      `insert into products (name, price, product_code)
        values ('${name}', '${price}', '${hashProductCode}')`
    );
    const data = await client.query(
      "select * from products where id = (select max(id) from products)"
    );
    response.end(JSON.stringify(data.rows));
  }
);

// 更新
router.put("/:id", async (request, response) => {
  const { name, price } = request.body;

  // 存在確認
  const product = await client.query(
    `select * from products where id = ${request.params.id}`
  );
  if (product.rows.length === 0) {
    return response.status(400).json({ message: "商品が存在しません。" });
  }

  // 商品コードチェック
  const isMatch = await bcrypt.compare(name, product.rows[0].product_code);
  if (!isMatch) {
    return response.status(400).json({ message: "商品コードが誤っています。" });
  }

  await client.query(
    `update products set
      price = ${price}
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
