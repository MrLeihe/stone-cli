const open = require('open')
const sites = require('./sites')

function search(keyword, options) {
    const keys = Object.keys(options)
    const froms = keys.length ? keys : ['default']
    froms.forEach(async from => {
        const searchUri = `${sites[from]}${keyword}`
        await open(searchUri)
    })
}

module.exports = search;