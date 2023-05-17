const router = require("express").Router();
const client = require("../util/connect");

router.post("/", async (request, response) => {
  const { email, password } = request.body;
  // バリデーション
  // 存在確認
  // ハッシュ化
  // ユーザ登録
  await client.query(
    `insert into users (email, password)
      values ('${email}', '${password}')`
  );
  const data = await client.query(
    "select * from users where id = (select max(id) from users)"
  );
  response.end(JSON.stringify(data.rows));
});

module.exports = router;
