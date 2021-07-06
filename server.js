'use strict';

//basic config
const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const { default: axios } = require('axios');
// const axios = require('axios');
const { response } = require('express');
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3031;

//connection with mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://hayabalasmeh:1234@cluster0-shard-00-00.svu8n.mongodb.net:27017,cluster0-shard-00-01.svu8n.mongodb.net:27017,cluster0-shard-00-02.svu8n.mongodb.net:27017/drink?ssl=true&replicaSet=atlas-lh448p-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

//building schema
const DrinkSchema = new mongoose.Schema({
    name: String,
    image: String
});

//building model
const DrinkModel = mongoose.model('Drink', DrinkSchema);


//building routes

//home route
//http://localhost:3031/
server.get('/', (req, res) => {
    res.send('welcome to home');
})

//getting from api route
//http://localhost:3031/gettingdrink
server.get('/gettingdrink', handelingGettingDrink);

//adding to fav route
//http://localhost:3031/addingtofav
server.post('/addingtofav', handelingAddingToFav);

//sending fav route
//http://localhost:3031/gettingFav
server.get('/gettingFav', handelingGettingFav);

//delteing fav
//http://localhost:3031/deletingFav
server.delete('/deletingFav', handelingDeletion)

//update route
//http://localhost:3031/update
server.put('/update', handelingUpdateFav)
server.get('*', (req, res) => {
    res.send('OOps this route not found')
})


//building functions
function handelingGettingDrink(req, res) {
    axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic').then(response => {
        const returnedData = response.data.drinks;
        // console.log(returnedData);
        res.send(returnedData);
    })
}
function handelingAddingToFav(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const fav = new DrinkModel({
        name: name,
        image: image
    })
    fav.save();
}
function handelingGettingFav(req, res) {
    DrinkModel.find({}, (error, data) => {
        if (error) {
            res.send(error)
        }
        else {
            res.send(data);
        }
    })
}
function handelingDeletion(req, res) {
    const id = req.query.id;
    console.log(id);
    DrinkModel.deleteOne({ _id: id }, (error, data) => {
        if (error) {
            res.send(error)
        }
        else {
            DrinkModel.find({}, (error, data) => {
                if (error) {
                    res.send(error)
                }
                else {
                    res.send(data);
                }
            })
        }
    })
}
function handelingUpdateFav(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const id = req.body.id;
    DrinkModel.findOne({ _id: id }, (error, data) => {
        if (error) {
            res.send(error)
        }
        else {
            data.name = name;
            data.image = image;
            data.save()
                .then(() => {
                    DrinkModel.find({}, (error, data) => {
                        if (error) {
                            res.send(error)
                        }
                        else {
                            res.send(data);
                        }
                    })
                })
        }
    })

}
//listening to port
server.listen(PORT, () => {
    console.log('listening to you');
})