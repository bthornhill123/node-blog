const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const Article = require('./models/article')
const app = express()

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
    // // hard-coded test data
    // const articles = [{
    //     title: 'test article',
    //     createdAt: new Date(),
    //     description: 'test description'
    // }]
    const articles = await Article.find().sort({ createdAt: 'desc' });
    
    res.render('articles/index', {
        articles: articles
    }) // this will render the index.ejs file within the views folder
})

app.listen(5000)
app.use('/articles', articleRouter)