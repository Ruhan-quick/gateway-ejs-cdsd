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
  //   let postUpload = {
  //     name: dt.name,
  //     email: dt.email,
  //     description: dt.description,
  //     imgurl: dt.imgurl,
  //   };
  //   console.log(postUpload);
  //   let sql = 'INSERT INTO users SET ?';
  //   connection.query(sql, postUpload, (req, result) => {
  //     if (err) {
  //       console.log('Your Data not Submitted to some error in your value');
  //     } else console.log('Your Data Successfully Submitted');
  //   });

  const sqlInsert =
    'INSERT INTO users (name, email, description, imgurl) values (?, ?,?,?)'; // whatever query you want
  connection.query(
    sqlInsert,
    [dt.name, dt.email, dt.description, dt.imgurl], // inserts into '?' symbol
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
app.get('/getall', (req, res, next) => {
  const sql = 'SELECT * from users';
  connection.query(sql, (err, results, fields) => {
    if (err) {
      console.log('failed', err);
    } else {
      console.log('succeed');
      res.json({ status: 'success', data: results });
    }
  });
});

app.get('/users', (req, res) => {
  res.render('users', {
    title: 'Users',
    data: [],
  });
});

app.listen(3000);
