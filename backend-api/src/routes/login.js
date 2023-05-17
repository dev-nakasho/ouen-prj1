const router = require("express").Router();
const client = require("../util/connect");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (request, response) => {
  const { email, password } = request.body;

  // 存在確認
  const user = await client.query(
    `select * from users where email = '${email}'`
  );
  if (user.rows.length === 0) {
    return response.status(400).json({ message: "ユーザが存在しません。" });
  }
  // パスワードチェック
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) {
    return response.status(400).json({ message: "パスワードが誤っています。" });
  }
  // トークン発行
  const token = jwt.sign({ email }, "secret-key");
  request.session.regenerate(() => {
    request.session.token = token;
    request.redirect(303, "/products"); // "/todos"
  });
});

module.exports = router;
