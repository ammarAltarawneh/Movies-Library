'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const server = express();
server.use(cors())

const movieData = require('./Movie Data/data.json');
const apiKey = process.env.APIkey;
const PORT = 3000;


server.get('/', homeHandler)
server.get('/favorite', favoritHandler)
server.get('/trending', trending)
server.get('*', defaultHandler)

function homeHandler(req, res) {
    let movie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.status(200).send(movie);
}

function favoritHandler(req, res) {
    res.status(200).send("Welcome to Favorite Page");
}

 async function trending(req,res){
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
    let axiosResult =  await axios.get(url);
    console.log(axiosResult.data)
    res.send(axiosResult.data.results[0].title) //go to the api address which is stored in data.json , you will find
                                            // obj of array called result, I want to access the array then the first
                                            // obj inside which has index of (0) then access title property.
}

function defaultHandler(req, res) {
    res.status(404).send('Page not found')
}


server.use(function (err, req, res, next) {
    console.error(err.stack);
    let obj = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    };
    res.status(500).send(obj);
});








function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})