const mongoose = require('mongoose')
// Converts markdown to HTML.
const marked = require('marked') // allows markdown conversion/rendering
const slugify = require('slugify') // allows creation of 'slugs' which are unique, url-friendly string for each article based on its title
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
// dompurifier allows the ability to create purified HTML through the use of the JSDOM's window object
// It is used to sanitize the HTML.
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // if no created date is supplied, it will call Date.now() (the function is being passed... hence no parans)
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        require: true
    }
})

// Right before validation is done, this function will be ran. It allows a hook for
// work you need done to be performed at the right time.
articleSchema.pre('validate', function(next) {
    // Create slug from the title
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if (this.markdown) {
        // This converts markdown to HTML, and then sanitizes it to remove any
        // possible malicious code.
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next() // this needs to be done
})

module.exports = mongoose.model('Article', articleSchema)