const cors = require('cors')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const server = require('http').createServer(app)

const sequelize = require('./models/index').sequelize;
const cookieParser = require('cookie-parser')

var router = express.Router();

var clients =[];

app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser())

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

//app.use('/auth',auth);
app.use('/users', require('./routes/users'));
app.use('/trade', require('./routes/trade'));
app.use('/wallet', require('./routes/wallet'));
app.use('/mypage', require('./routes/mypage'));
app.use('/pwd', require('./routes/pwd'));


//socket io 추가
app.io = require('socket.io')(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});



var clients = [];

app.io.on('connection', (socket) => {

  console.log("a user connected");
  console.log("socket ID: ", socket.id);

  socket.on('storeClientInfo', (data) => {
    var clientInfo = new Object();
    console.log("socket ID: ", data.id);
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    clients.push(clientInfo);
  })




  socket.on('login', (data) => {
    console.log('user connect!!!');
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
  });
  


  socket.on('disconnect', (msg) => {
    console.log('user disconnected: ', msg);
  });

  socket.on('alarm', (msg) => {
    console.log('alarm요청!!!');
    socket.emit('alarm', msg);
  });

});


// socket io 통신
app.get('/alarm', function (req, res, next) {
  console.log('alarm 통신')

  app.io.emit('alarm', "ㅁㄴㄻㅇ나ㅣ러마")
});


server.listen(5555, function () {
  console.log('Example app listening on port 5555!');

  // require('./models').sequelize.sync({force:flase})
  // .then(()=>{
  //   console.log('Databases sync');
  // });
});

sequelize.sync();

