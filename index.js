const express = require('express');
const app = express();
const port = 1212;
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({path: "./.env"});

app.set("view engine",'hbs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//define routes
app.use("/", require('./routes/register_route'));
app.use("/register", require('./routes/register_route'));
app.use("/auth", require('./routes/auth_route'));
app.use(cookieParser())

app.listen(port, ()=>{
    console.log("server started");
    
});