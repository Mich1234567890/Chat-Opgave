const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// SETUP

// MIDDLEWARE

//ROUTES

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
})