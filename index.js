require('dotenv/config')

const { google } = require('googleapis')
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')

const names = require('./names')

async function start(){
    const searchTerm = 'cat'
    const urlsFromGoogle = await fetchImagesFromGoogle(searchTerm)
    await downloadAllImages(urlsFromGoogle)

    async function fetchImagesFromGoogle(searchTerm){
        console.log(`> Procurando imagens para ${searchTerm}`)

        const response = await customSearch.cse.list({
            auth: process.env.GOOGLE_API_KEY,
            cx: process.env.SEARCH_ENGINE_ID,
            q: searchTerm,
            num: 10,
            searchType: 'image'
        })
    
        const urls = response.data.items.map(item => item.link)
        
        return urls
    }

    async function downloadAllImages(urls){
        console.log('> Baixando imagens')
        urls.forEach(async (url, index) => {
            try{
                await downloadImage(url, `imagem-${index}.png`)
                console.log(`> Imagem baixada: (${index}) ${url}`)
            } catch(error){
                console.log(`> Erro ao baixar imagem (${url})! ${error}`)
            }
        })
    }

    async function downloadImage(url, filename){
        return imageDownloader.image({
            url: url,
            dest: `./images/${filename}`
        })
    }
}

start()

