// express初期化
const express = require("express");
const app = express();

const productRouter = require("./routes/products");

const port = 3000;
const host = "localhost"; // 127.0.0.1

// リクエストボディからデータ取得を許可
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);

// サーバー起動
app.listen(port, host, () => {
  console.log(`server listen on http://${host}:${port}/`);
});
