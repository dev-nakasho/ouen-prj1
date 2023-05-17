// express初期化
const express = require("express");
const app = express();

const session = require("express-session");
const jwt = require("jsonwebtoken");

const productRouter = require("./routes/products");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");

const port = 3000;
const host = "localhost"; // 127.0.0.1

// リクエストボディからデータ取得を許可
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false },
  })
);

app.use(
  "/products",
  (request, response, next) => {
    const token = request.session.token;
    if (!token) {
      return response
        .status(400)
        .json({ message: "権限がないためログインしてください。" });
    }
    jwt.verify(token, "secret-key", (error) => {
      if (error) {
        return response
          .status(400)
          .json({ message: "ログイン情報に誤りがあります。" });
      }
    });
    next();
  },
  productRouter
);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// サーバー起動
app.listen(port, host, () => {
  console.log(`server listen on http://${host}:${port}/`);
});
