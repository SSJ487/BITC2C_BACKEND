const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());

app.use('/index',require('./routes/index'));
app.use('/users',require('./routes/users'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

  // require('./models').sequelize.sync({force:flase})
  // .then(()=>{
  //   console.log('Databases sync');
  // });
});



