require('dotenv/config')
const { google } = require('googleapis')
const customSearch = google.customsearch('v1')

const names = require('./names')

async function start(){
    const response = await customSearch.cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.SEARCH_ENGINE_ID,
        q: 'cat',
        num: 10,
        searchType: 'image'
    })

    const urls = response.data.items.map(item => item.link)

    console.dir(urls, { depth: null })

}

start()

