const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mysql = require('mysql');

// create the connection to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3309',
  database: 'cd_st',
  insecureAuth: true,
});

connection.connect((err, res) => {
  if (err) {
    console.log('Error in Database Connection');
    console.log(err);
  } else console.log('DB Connected');
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

app.get('/', (req, res) => {
  res.render('index', {
    title: 'gateway1 ejs',
  });
});

app.post('/uploadx', (req, res, next) => {
  console.log(req.body);
  next();
});

app.post('/upload', (req, res, next) => {
  const dt = req.body;

  const sqlInsert =
    'INSERT INTO users (name, email, description, imgurl) values (?, ?,?,?)'; // whatever query you want
  connection.query(
    sqlInsert,
    [dt.name, dt.email, dt.description, dt.imgurl],
    (err, results, fields) => {
      if (err) {
        console.log('failed', err);
      } else {
        console.log('succeed', results);
      }
    }
  );
  res.redirect('/users');
});

app.get('/delete/:id', (req, res, next) => {
  console.log('delete called');
  let todelete = req.params.id;
  console.log(todelete);
  let sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [todelete], (err, results, fields) => {
    if (err) {
      console.log('failed', err);
    } else {
      console.log('succeed', results);
    }
  });
  next();
});

app.post('/update', (req, res, next) => {
  let toupdate = req.params;
  const dt = req.body;
  let name = dt.name;
  let email = dt.email;
  let description = dt.description;
  let imgurl = dt.imgurl;
  let sql = `UPDATE users SET name=${name}, email = ${email}, description=${description}, imgurl = ${imgurl} WHERE id = ${toupdate}`;
  connection.query(sql, (err, result) => {});
});

//Getting users
app.get('/getall', async (req, res, next) => {
  const sql = 'SELECT * from users';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.log('failed', err);
    } else {
      allU = results;
      // res.json({ status: 'success', data: results });
      // res.render('users', {
      //   title: 'Users',
      //   uu: allU,
      //   data: [],
      // });
    }
  });
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * from users';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.log('failed', err);
    } else {
      res.render('users', {
        title: 'Users',
        data: results,
      });
    }
  });
});

app.listen(3000);
