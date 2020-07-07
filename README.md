# Você é um gerador

Gerador de fotos de paginas do tipo *"você é um ..."*

## Como funciona?

A ideia por enquanto é perguntar para o usuário um tipo de foto, pesquisar na API do Google Images, armazenar uma lista de nomes comuns e cruzar esses dados com ferramenta Image Magic.

A lista de nomes foi tirada do [IBGE](https://censo2010.ibge.gov.br/nomes/#/ranking) e mais alguns foram acrescentados

A busca de imagens é feita com a API Custom Search do Google e para fazê-la funcionar é preciso criar um `.env` na raiz do projeto e fornecer uma `API_KEY`, conforme o modelo `.env.example`.

Para conseguir uma `API_KEY` você pode assistir [esse vídeo](https://www.youtube.com/watch?v=LzPuCVhdUew&t=88s), ou acessar diretamente o site do [Google Cloud Plataform](https://cloud.google.com/)

Então basta mudar o `searchTerm` para o assunto que você quiser no arquivo `index.js` e rodar o projeto com os seguintes comandos:

```bash
npm install
npm start
```

### Alguns resultados

![Coelho José](images/exemplo1.png)
![Gato Pedro](images/exemplo2.png)
![Gata Fernanda](images/exemplo3.png)