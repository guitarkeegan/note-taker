const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const port = 3000;

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/api/notes", (req, res)=>{

    fs.readFile("./db/db.json", (err, data)=>{
       err ? console.log(err) : res.json(data);
    })
})
.post("/api/notes", (req, res)=>{
    const {title, text} = req.body;
    const id = uuidv4();
    console.log(id);
    if (title && text){
        const newPost = {
            title: title,
            text: text,
            id: id
        }
    }
   
    fs.appendFile("./db/db.json", JSON.stringify(newPost))
})