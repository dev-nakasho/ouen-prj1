const router = require("express").Router();
const client = require("../util/connect");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

router.post(
  "/",
  body("email")
    .isEmail()
    .withMessage("メールアドレスを正しく入力してください。"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードを8文字以上入力してください。"),
  async (request, response) => {
    const { email, password } = request.body;

    // バリデーション
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    // 存在確認
    const isExist = await client.query(
      `select * from users where email = '${email}'`
    );
    if (isExist.rows.length !== 0) {
      return response.status(400).json({ message: "すでに登録されています。" });
    }
    // ハッシュ化
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // ユーザ登録
    await client.query(
      `insert into users (email, password)
      values ('${email}', '${hashPassword}')`
    );
    const data = await client.query(
      "select * from users where id = (select max(id) from users)"
    );
    response.end(JSON.stringify(data.rows));
  }
);

module.exports = router;
