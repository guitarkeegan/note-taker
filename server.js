const express = require("express");
const fs = require("fs");
const path = require("path");
// package to generate random id
const { v4: uuidv4 } = require('uuid');
// port to work with heroku or locally
const port = process.env.PORT || 3000;

const app = express();

// enable json parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// use the public folder
app.use(express.static("public"));

// route to render the notes.html
app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
// chained get and post routes to get and save to the json file.
app.route("/api/notes")
.get((req, res)=>{
    fs.readFile("./db/db.json", (err, data)=>{
       if (err){
        console.error(err);
       } else {
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
       }
    })
}) 
.post((req, res)=>{
    const {title, text} = req.body;
    if (title && text){ // check to see if title and text exist
        const newPost = { // create new object to store
            title: title,
            text: text,
            id: uuidv4()
        }

        // read the existing json
        fs.readFile("./db/db.json", (err, data)=>{
            if (err){
                console.error(err);
            } else { // parse json to array, then write to new file
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newPost);
                fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4), writeErr=> writeErr ? console.error(writeErr) : console.info("Updated notes!"))
            }
         })
         res.status(201).json({status: "success", body: newPost});

    } else {
        res.status(500).json("Error making post");
    }  
});
// create delete route to remove notes from the json
app.delete("/api/notes/:id", (req, res)=>{
    const idToDelete = req.params.id;
    
    fs.readFile("./db/db.json", (err, data)=>{
        if (err){
            console.error(err); 
        } else {
            const parsedNotes = JSON.parse(data);
            for (let note of parsedNotes){

                if (note.id === idToDelete){
                
                    const indexToDelete = parsedNotes.indexOf(note);

                    parsedNotes.splice(indexToDelete, 1);

                    fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4), writeErr=>
                    writeErr ? console.error(writeErr) : console.info("Updated notes!"))
                    
                    res.status(200).json({status: "success", body: "Item deleted"});
                
                }
           }
        }
    })
})
// default route for landing page
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, ()=>{
    console.log("App lisening on port " + port);
});