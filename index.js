require('dotenv/config')

const { google } = require('googleapis')
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')
const gm = require('gm').subClass({ imageMagick: true })

const names = require('./names')

async function start(){
    const searchTerm = 'rabbit'
    
    const urlsFromGoogle = await fetchImagesFromGoogle(searchTerm)
    await downloadAllImages(urlsFromGoogle)
    await convertAllImages(urlsFromGoogle.length)

    
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
        console.log(`\t-> ${response.data.items.length} imagen(s) encontrada(s)!`)

        return urls
    }

    async function downloadAllImages(urls){
        for(let i = 0; i < urls.length; i++){
            try{
                await downloadImage(urls[i], `imagem-${i}.png`)
                console.log(`> Imagem ${i} baixada!`)
                
            } catch(error){
                console.log(`> Erro ao baixar imagem (${i})! ${error}`)
            }
        }
    }

    async function downloadImage(url, filename){
        return imageDownloader.image({
            url: url,
            dest: `./images/${filename}`
        })
    }

    async function convertAllImages(numberOfImages){
        for(let i = 0; i < numberOfImages; i++){
            await convertImage(i)
        }
    }

    async function convertImage(index){
        return new Promise((resolve, reject) => {
            const inputFile = `./images/imagem-${index}.png[0]`
            const outputFile = `./images/convertida-${index}.png`
            const width = 1080
            const height = 1080

            gm()
                .in(inputFile)
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-blur', '0x9')
                    .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .out('-fill', 'white')
                .out('-undercolor', 'black')
                .out('-pointsize', '150')
                .out('-gravity', 'north')
                .out('-annotate', '+0+5')
                .out(` ${names[index]} `)
                .write(outputFile, (error) => {
                    if(error){
                        return reject(error)
                    }

                    console.log(`> Imagem convertida: ${outputFile}`)
                    resolve()
                })

        })
    }
}

start()

