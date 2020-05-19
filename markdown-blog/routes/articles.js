const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

// show
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/') // if article doesn't exist -> route to the home page
    res.render('articles/show', { article: article })
})

// Posts an article
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next() // Goes on to the next funtion in our list
}, saveArticleAndRedirect('new'))


// Route to edit an article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

// needs an action method="DELETE"
router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

// This function has logic that was shared between the 'new' and 'edit' endpoints.
// It has been separated into this method whereby the caller specifies the path to redirect to.
function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
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