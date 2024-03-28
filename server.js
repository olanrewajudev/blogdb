const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload')

require("dotenv").config()

const app = express()
const port = process.env.PORT || 6010

app.use(cors())
app.use(express.json())
app.use(fileupload())
app.use(express.static('Public'))
app.use('/api/user', require('./Router/userRouter'))
app.listen(port, () => console.log(`my blog is runing on localhost:${port}`))