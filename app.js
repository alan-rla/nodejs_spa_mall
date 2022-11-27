const express = require('express');
const app = express();
const port = 3000;

const goodsRouter = require("./routes/goods.js")
const cartsRouter = require("./routes/carts.js")
const connect = require("./schemas");
connect();

app.use(express.json()); // request 안에 body/body-parser Middleware를 쓰기위한 문법

// localhost:3000/api
app.use("/api", [goodsRouter, cartsRouter]);

app.post("/", (req, res) => {
    console.log(req.body);

    res.send("기본 URL에 POST 메소드가 정상적으로 실행되었습니다.");
});

app.get("/", (req, res) => {
    console.log(req.query);

    res.status(400).json({
        "KeyKey" : "value 입니다",
        "이름입니다" : "이름일까요?",
    });
});

app.get("/:id", (req,res) => {
    console.log(req.params);

    res.send(":id URL에 정상적으로 반환되었습니다.")
})

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});