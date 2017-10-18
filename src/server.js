const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const cookiePool = require('./cookie-pool')
const bodyParser = require('body-parser')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/img*.png', (req, res) => {
    cookiePool.get(60 * 1000 * 60 * 5).then((cookie) => {
        console.log("cookie gone!");
        res.json({
            key: cookie.key,
            value: cookie.value
        })
    })
})

app.post('/store', (req, res) => {
    let cookie = {
        key: '',
        value: ''
    }
    cookie.key = req.body.key
    cookie.value = req.body.value
    cookiePool.set(cookie);
    res.send("OK")
})

app.get('/size', (req, res) => {
    let size = cookiePool.getPoolSize()
    res.send(size + '')
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
