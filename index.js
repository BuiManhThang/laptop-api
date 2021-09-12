const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const productRouter = require('./routers/product');
const manufacturerRouter = require('./routers/manufacturer');
const classRouter = require('./routers/classRouter');
const userRouter = require('./routers/userRouter');
const commentRouter = require('./routers/commentRouter');
const receiptRouter = require('./routers/receiptRouter');

dotenv.config();

const app = express();

// const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connect to db success!');
})
.catch((err) => {
    console.log(`Has some error: ${err}`);
})

app.use(cors({
    origin: ['http://localhost:3000', 'https://buimanhthang.github.io'],
    optionsSuccessStatus: 200,
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded())
app.use(express.static('./public'));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json('hello')
})
app.use('/products', productRouter);
app.use('/manufacturers', manufacturerRouter);
app.use('/classes', classRouter);
app.use('/user', userRouter);
app.use('/receipt', receiptRouter);
app.use('/comment', commentRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server on`);
})