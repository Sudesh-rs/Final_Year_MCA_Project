const express = require('express');
const connectDB = require('./config/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send({message:'Welcome To IntelliMart Backend System!'});
});

app.use(bodyParser.json());

const productRouters=require("./routers/productRoutes.js")
const authRouters=require("./routers/authRouters.js")
const adminRouters=require("./routers/adminRouters.js")
const cartRouters=require("./routers/cartRoutes.js")
const revenueRouters=require("./routers/revenueRoutes.js")
const sellerOrderRouters=require("./routers/sellerOrderRoutes.js")
const sellerProductRouters=require("./routers/sellerProductRoutes.js")
const sellerReportRouters=require("./routers/sellerReportRoutes.js")
const sellerRouters=require("./routers/sellerRoutes.js")
const transactionRouters=require("./routers/transactionRoutes.js")
const userRouters=require("./routers/userRoutes.js")
const wishlistRouters=require("./routers/wishlistRoutes.js")
const orderRouters=require("./routers/orderRoutes.js")
const paymentRoutres=require("./routers/paymentRoutes.js")
const dealRoutres=require("./routers/dealRoutes.js")
const couponRouters=require("./routers/couponRoutes.js")
const homeRouters=require("./routers/homeCategoryRoutes.js")
const chatboatRouters=require("./routers/chatboatRoutes.js")
const reviewRouters=require("./routers/reviewRouters.js")

app.use('/auth', authRouters);
app.use("/api/users",userRouters)
app.use("/sellers", sellerRouters)
app.use("/products", productRouters)
app.use("/api/sellers/product", sellerProductRouters)
app.use("/api/cart", cartRouters);
app.use("/api/orders", orderRouters);
app.use("/api/seller/orders",sellerOrderRouters)
app.use("/api/transactions", transactionRouters)
app.use("/api/wishlist", wishlistRouters)
app.use("/api/sellers/report",sellerReportRouters)

app.use("/api/payment", paymentRoutres)
app.use("/home",homeRouters)
app.use("/admin/deals",dealRoutres)
app.use("/admin",adminRouters)

app.use("/api/coupons",couponRouters)
app.use("/api/sellers/revenue",revenueRouters)

app.use("/api/reviews",reviewRouters)

// chatboat
app.use("/chat",chatboatRouters)

const port = process.env.PORT || 8080;
app.listen(port, async() => {
    await connectDB()
  console.log(`Server is running on port ${port}`);
});
// 