const cors = require('cors')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const server = require('http').createServer(app)

const sequelize = require('./models/index').sequelize;
const cookieParser = require('cookie-parser')

const alarm = require('./routes/alarm');
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
app.use('/alarm', alarm.router);
app.use('/web3',require('./routes/web3'));

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

  socket.emit('storeClientInfo');

  socket.on('storeClientInfo', (data) => {
    var clientInfo = new Object();
    console.log("User ID: ", data.id);

    alarm.create(socket.id, data.id)
    clientInfo.customId = data.Id;
    clientInfo.clientId = socket.id;

    clients.push(clientInfo);
  })


  const req = socket.request;
  //console.log('SOCKET.REQUEST = ',req);

  socket.on('login', (data) => {
    var clientInfo = new Object();
    clientInfo.uid = data.uid;
    clientInfo.id = socket.id;
    clients.push(clientInfo);
  });
  


  socket.on('disconnect', (msg) => {
    console.log('user disconnected: ', msg);
  });


  // socket io 통신
  app.post('/alarm', function (req, res, next) {
    console.log('alarm 통신 ', req.body.id)
    alarm.find(req.body.id).then((user) => {
      user = JSON.parse(JSON.stringify(user));

      console.log("find alarm object", user)

      console.log("found alarm object one: ", user.socketId);

      socket.to(user.socketId).emit('alarm', "안뇽하세용");
    })

  });

});




server.listen(5555, function () {
  console.log('Example app listening on port 5555!');

  // require('./models').sequelize.sync({force:flase})
  // .then(()=>{
  //   console.log('Databases sync');
  // });
});

sequelize.sync();
