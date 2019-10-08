var path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
var sequelize = require('./models/index').sequelize;
var cookieParser = require('cookie-parser')


app.use(bodyParser.json());
app.use(cookieParser())



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//app.use('/auth',auth);
app.use('/login', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/emailcheck', require('./routes/emailcheck'));
app.use('/tradeboards', require('./routes/tradeboards'));

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.listen(5555, function () {
  console.log('Example app listening on port 5555!');

  // require('./models').sequelize.sync({force:flase})
  // .then(()=>{
  //   console.log('Databases sync');
  // });
});

sequelize.sync();

