const express = require('express');
const { db } = require('../schemas/goods');
const router = express.Router();

// Schema 호출
const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods");


// 장바구니 CRUD
router.post("/goods/:goodsId/cart", async (req, res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId});
    if (existsCarts.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }

    await Cart.create({goodsId, quantity});

    res.json({result: "success"});
});

router.get("/goods/carts", async (req, res) => {
    const carts = await Cart.find({}); // 로그인 기능이 없어 사용자 한명에 대한 장바구니 기능을 수행하므로 find 안에 값이 없다
    // carts 객체 형태
    // [
    //     {goodsId, quantity},
    //     {goodsId, quantity}
    // ]
    const goodsIds = carts.map((cart) => {
        return cart.goodsId;
    })

    const goods = await Goods.find({goodsId : goodsIds})
    // Goods에 해당하는 모든 정보를 DB에서 가져오고 goodsIds 변수안에 존재하는 값일 때 조회
    
    const results = carts.map((cart) => {
        return {
            "quantity" : cart.quantity,
            "goods" : goods.find((item) => item.goodsId === cart.goodsId) // 해당 find는 배열에 대한 find
        }
    })

    res.json({
        "carts" : results
    })
});

router.put("/goods/:goodsId/cart", async (req, res) => {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    if (quantity < 1) {
        res.status(400).json({ errorMessage: "수량은 1 이상이어야 합니다." });
        return;
    }

    const existsCarts = await Cart.find({goodsId});
    if (existsCarts.length) {
        await Cart.updateOne({goodsId: goodsId},{$set: {quantity: quantity}});
    }
    res.status(200).json({success: true});
})

router.delete("/goods/:goodsId/cart", async (req, res) => {
    const {goodsId} = req.params;

    const existsCarts = await Cart.find({goodsId});
    if (existsCarts.length) {
        await Cart.deleteOne({goodsId});
    }

    res.json({result: "success"});    
});

// 상품 GET/POST
router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

    const goods = await Goods.find({ goodsId });
    if (goods.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

    res.json({ goods: createdGoods });
});


router.get("/goods", (req, res) => {
    res.status(200).json({goods});
});

router.get("/goods/:goodsId", (req, res) => {
    const {goodsId} = req.params;

    const [result] = goods.filter((good) => Number(goodsId) === good.goodsId);

    res.status(200).json({"detail" : result});
});

module.exports = router;

