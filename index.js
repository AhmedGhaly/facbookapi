const express = require('express')
const http = require('http')
const logger = require('morgan')
const cors = require('cors')
const body_parse = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express();


app.use(cors())
app.use(body_parse.json())
app.use(logger('dev'))

///// routers /////////////
 
const HomeRouter = require('./routes/Home.routes')
const authRouter = require('./routes/auth.routes')

app.use(HomeRouter)
app.use('/user', authRouter)

////////////// server config /////////////////
const port = process.env.PORT;
// app.set('port', port);
mongoose.connect(process.env.DB_URL).then(() => {
    const server = http.createServer(app);
    
    server.listen(port);

}).catch(err => {
    console.log('ther is an errori in the database + ' + err)
})