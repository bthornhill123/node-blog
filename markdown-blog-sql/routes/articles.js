const express = require('express')
const Article = require('./../models/article')
const mysql = require('mysql')

// Create mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nodeblog'
})
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected.')
})
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: { title: "", description: ""} })
})

router.get('/edit/:id', async (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${ req.params.id }`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('articles/edit', { article: result[0] })
    })
})

// Show Full Details of Blog Entry
router.get('/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${ req.params.id }`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result == null) { 
            res.redirect('/');
        }
        res.render('articles/show', { article: result[0] })
    })
})

// Post New Article
router.post('/', async (req, res, next) => {
    let article = { title: req.body.title, description: req.body.description }
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, article, (err, result) =>{
        if (err) throw err;
        res.redirect(`/articles/${ result.insertId }`)
    })    
})


// Edit Existing Article
router.put('/:id', async (req, res, next) => {
    let sql = `UPDATE posts SET title = '${ req.body.title }', description = '${ req.body.description }' WHERE id = ${ req.params.id }`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect(`/articles/${ result.insertId }`)
    });

    //req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', (req, res) => {
    console.log('id is', req.params.id)
    let sql = `DELETE FROM posts WHERE id = ${ req.params.id }`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/')
    });
})

// This function has logic that was shared between the 'new' and 'edit' endpoints.
// It has been separated into this method whereby the caller specifies the path to redirect to.
function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        // article.markdown = req.body.markdown
        try {
            // 
            article = await article.save()
            res.redirect(`/articles/${ article.slug }`)
        }
        catch (e) {
            console.log(e);
            // on failure:
            // (1) redirect back to the page where it failed
            // (2) pass the article object so that the fields get repopulated
            res.render(`articles/${ path }`, { article: article})
        }
    }
}

module.exports = router