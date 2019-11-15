const cors = require('cors')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const server = require('http').createServer(app)

const sequelize = require('./models/index').sequelize;
const cookieParser = require('cookie-parser')

const alarm = require('./routes/alarm');
const chart = require('./routes/chart');
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
app.use('/chart', chart.router);

//socket io 추가
app.io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
});

app.io.set()

var clients = [];

function registerUser(socket, user_id) {

  // socket_id와 nickname 테이블을 셋업
  console.log("???????@?@?@?: ", socket.id)

  if (clients[user_id] != undefined) delete clients[user_id];

  clients[user_id] = socket.id

  console.log("!!!!!: ", clients[user_id])

}


app.io.on('connection', (socket) => {

  console.log("a user connected");
  console.log("socket ID: ", socket.id);

  socket.on('storeClientInfo', (data) => {
    
    console.log("User ID: ", data);

    // alarm.create(socket.id, data.id)

    registerUser(socket, data);

  })


  socket.on('alarm', (msg) => {
    console.log('socket alarm: ', msg);
    socket.emit('alarm', "안녕")
  });

  socket.on('trading', (data) => {
    
    console.log('trading opponent: ', clients[data.opponentID]);
    console.log('my trading: ', clients[data.userId]);
    console.log('tableid: ', data.tableId)

    alarm.create(clients[data.opponentID], data.opponentID, data.tableId)
    alarm.create(clients[data.userId], data.userId, data.tableId)

    socket.emit('alarm', "안녕!")
    socket.to(clients[data.opponentID]).emit('alarm', "안녕!")

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



function timer(){
  var loop = setInterval(()=> {
    chart.chart('Atoken').then(result1 => {
      chart.chart('Btoken').then(result2 => {
        chart.chart('Ctoken').then(result3 => {
          console.log("chartDB Update done ");
        })
      })
    })
  }, 36000000)
}


timer();

server.listen(5555, function () {
  console.log('Example app listening on port 5555!');

  // require('./models').sequelize.sync({force:flase})
  // .then(()=>{
  //   console.log('Databases sync');
  // });
});

sequelize.sync();
