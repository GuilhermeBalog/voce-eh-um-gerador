require('dotenv/config')

const readline = require('readline-sync')
const { google } = require('googleapis')
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')
const gm = require('gm').subClass({ imageMagick: true })

const names = require('./names')

async function start(){
    const state = {}
    state.searchTerm = readline.question('Digite o tema da sua página (ex: dog, cat, car): ')
    state.names = names.map(name => { return { name } })
    console.log(`> Criando imagens de ${state.searchTerm} para ${state.names.length} nomes`)

    await fetchImagesFromGoogle(state)
    await downloadAllImages(state)
    await convertAllImages(state)
    
    async function fetchImagesFromGoogle(state){
        for(const name of state.names){
            console.log(`> Procurando imagens para ${state.searchTerm} ${name.name}`)
            
            const response = await customSearch.cse.list({
                auth: process.env.GOOGLE_API_KEY,
                cx: process.env.SEARCH_ENGINE_ID,
                q: `${state.searchTerm} ${name.name}`,
                num: 3,
                searchType: 'image'
            })
            name.images = response.data.items.map(item => item.link)
        }
    }

    async function downloadAllImages(state){
        state.downloadedImages = []

        for(let nameIndex = 0; nameIndex < state.names.length; nameIndex++){
            const { images } = state.names[nameIndex]

            for(let imageIndex = 0; imageIndex < images.length; imageIndex++){
                const imageUrl = images[imageIndex]

                try{
                    if(state.downloadedImages.includes(imageUrl)){
                        throw new Error('Essa imagem já foi baixada!')
                    }

                    await downloadImage(imageUrl, `imagem-${nameIndex}.png`)
                    state.downloadedImages.push(imageUrl)
                    console.log(`> Imagem ${nameIndex} baixada!`)
                    break

                } catch(error){
                    console.log(`> Erro ao baixar imagem ${nameIndex}: ${error}`)
                }
            }
        }
    }

    async function downloadImage(url, filename){
        return imageDownloader.image({
            url: url,
            dest: `./images/${filename}`
        })
    }

    async function convertAllImages(state){
        for(let nameIndex = 0; nameIndex < state.names.length; nameIndex++){
            await convertImage(nameIndex, state.names[nameIndex].name)
        }
    }

    async function convertImage(index, name){
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
                .out(` ${name} `)
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

