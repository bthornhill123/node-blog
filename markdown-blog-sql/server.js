const express = require('express')
const mongoose = require('mongoose')
const mysql = require('mysql')

// Create mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // password: 'password1'
    database: 'nodeblog'
})
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected.')
})

const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const Article = require('./models/article')
const app = express()

// Create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodeblog'
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('The database was created.')
    })
})

// Create table
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Table Created');        
    })
})

const connectionUri = 'mongodb+srv://bthorn19:Skywalker3@cluster0-jdspq.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method')) // whenever parameter _method is defined in a form, it will override
app.use(express.static(__dirname + '/public'))

app.get('/', async (req, res) => {
    // TODO - select blog posts from mysql
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('articles/index', {
            articles: results
        })
    })
})

app.listen(5000)
app.use('/articles', articleRouter)