const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', 'views');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

app.get('/', (req, res) => {
  res.render('index', {
    title: 'gateway1 ejs',
  });
});

app.post('/panel', (req, res, next) => {
  console.log(req.body.Email);
  next();
});

app.listen(3000);
