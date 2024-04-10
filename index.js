const express = require("express");
const app = express();

var cors = require('cors');
app.use(cors());

app.use(express.json());

//for accessing the static file url
app.use(express.static('uploads'));

const fs = require('fs');

const port = process.env.PORT || 10000;

require("./db/connection");

const routes = require("./routing");


app.use("/api", routes);

app.get("/", async (req, res) => {
    
    res.send("Your app is running perfectly...");
})

app.listen(port, ()=>{
    console.log(`Your app listening at port ${port}`);
})