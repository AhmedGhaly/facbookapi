const express = require('express')
const http = require('http')
const logger = require('morgan')
const cors = require('cors')
const body_parse = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path =require('path')
require('dotenv').config()


////// multer setting //////////////////
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  

//////////////////////////////////////


const app = express();


app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(body_parse.json())
app.use(logger('dev'))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

///// routers /////////////
 
const HomeRouter = require('./routes/Home.routes')
const authRouter = require('./routes/auth.routes')
const postRouter = require('./routes/post.routes')
const commentRouter = require('./routes/comment.routes')
const nestedCommentRouter = require('./routes/nestedComment.routes')
const friendRouter = require('./routes/friend.routes')

app.use(HomeRouter)
app.use('/user', authRouter)
app.use(postRouter)
app.use(commentRouter)
app.use('/nest', nestedCommentRouter)
app.use(friendRouter)

////////////// server config /////////////////
const port = process.env.PORT;
// app.set('port', port);
mongoose.connect(process.env.DB_URL).then(() => {
    const server = http.createServer(app);
    
    server.listen(port);

}).catch(err => {
    console.log('ther is an errori in the database + ' + err)
})