const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

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
    if (title && text){
        const newPost = {
            title: title,
            text: text,
            id: uuidv4()
        }

        fs.readFile("./db/db.json", (err, data)=>{
            if (err){
                console.error(err);
            } else {
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

app.delete("/api/notes/:id", (req, res)=>{
    const idToDelete = req.params.id;
    
    fs.readFile("./db/db.json", (err, data)=>{
        if (err){
            console.error(err); // why this instead of log? // when to console log or res.json(send response)?
        } else {
            const parsedNotes = JSON.parse(data);
            console.log(parsedNotes);
            for (let note of parsedNotes){
                console.log("hit for");
                console.log(note.id, idToDelete);
                if (note.id === idToDelete){
                
                    const indexToDelete = parsedNotes.indexOf(note);

                    parsedNotes.splice(indexToDelete, 1);

                    fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4), writeErr=>
                    writeErr ? console.error(writeErr) : console.info("Updated notes!"))
                    // console.info ?
                    res.status(200).json({status: "success", body: "Item deleted"});
                
                }
           }
        }
    })
})

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, ()=>{
    console.log("App lisening on port " + port);
});