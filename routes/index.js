
const express = require('express')
const productRoute = require('./product.route')
const categoryRoute = require('./category.route')
const cartRoute = require("../routes/cart.route");
const orderRoute = require("../routes/order.route");
const postRoute = require("../routes/post.route");
const authRoute = require("../routes/auth.route");

const router = express.Router()

// *** Module Main Routes *****
router.use('/product', productRoute)
router.use('/category', categoryRoute)
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/post", postRoute);
router.use("/auth", authRoute);


module.exports = router