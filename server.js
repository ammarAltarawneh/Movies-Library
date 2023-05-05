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
server.get('/search', search)
server.get('/top_rated', topRated)
server.get('/similar_movies', SimilarMovies);
server.get('*', defaultHandler)

///////////// handler functions
function homeHandler(req, res) {
    let movie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    res.status(200).send(movie);
}

function favoritHandler(req, res) {
    res.status(200).send("Welcome to Favorite Page");
}

function trending(req, res) {
    try {
        let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let trendingMovie = new FilmInfo(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return trendingMovie
                })

                res.send(mapResult)
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function search(req, res) {
    try {
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`;
        axios.get(url)
            .then(result => {

                let searchMovie = result.data.results.map(item => {
                    let movie = new FilmInfo(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return movie;
                })
                res.send(searchMovie);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function topRated(req, res) {
    try {
        let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
        axios.get(url)
            .then(result => {

                let topRatedMovie = result.data.results.map(item => {
                    let movie = new FilmInfo(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return movie;
                })
                res.send(topRatedMovie);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function SimilarMovies(req, res) {
    try{
        let url = `https://api.themoviedb.org/3/movie/10468/similar?api_key=${apiKey}&language=en-US&page=1`;
        axios.get(url)
            .then(result => {
                
                let similarMovie = result.data.results.map(item => {
                    let movie = new FilmInfo(item.id, item.title, item.release_date, item.poster_path, item.overview)
                    return movie;
                })
                res.send(similarMovie);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
        }
        catch(error){
            errorHandler(error,req,res);
        }
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

function errorHandler(error,req,res){
    const err={
        errNum:500,
        msg:error
    }
}


////////////////////////



function FilmInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview
}

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})