const express = require('express');

const server = express();

const movieData = require('./Movie Data/data.json');

const PORT = 3000;


function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


server.get('/', (req, res) => {
    let movie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.status(200).send(movie);
});

server.get('/favorite', (req, res) => {
    
    res.status(200).send("Welcome to Favorite Page");
});


server.use(function(err, req, res, next) {
    console.error(err.stack);
    let obj = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
        };
    res.status(500).send(obj);
  });


server.get('*', (req, res) => {
    res.status(404).send('Page not found')
})

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})