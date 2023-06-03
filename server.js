const express = require("express");
const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

var allNotes;

//GET requests below
app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/notes", (req, res)=> {
    res.sendFile(path.join(__dirname, "public/notes.html"))
})


//pull exsisting notes, if any.
app.get("/api/notes", (req, res)=> {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        err ? console.log(err) : res.json(JSON.parse(data)) 
    })
})

//delete route .. found .filter method on mozilla.org/ instead of maping.
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        err ? console.log(err) : 
        allNotes = JSON.parse(data)
        let remaining = allNotes.filter((note) => note.id != req.params.id)
        console.log(remaining)
        fs.writeFile("./db/db.json", JSON.stringify(remaining), (err)=>{
            err ? console.log(err) : console.log("deleted")
        })
        res.sendFile(path.join(__dirname, "public/notes.html"))
        
    })
})
        

//POST route
app.post("/api/notes", (req, res) => {
    const { title, text} = req.body;

    if (title && text){
        const newNote = {
            title, 
            text, 
            id: uuidv4()
        };
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            allNotes = JSON.parse(data)
            allNotes.push(newNote)
            fs.writeFile("./db/db.json", JSON.stringify(allNotes), (err)=>{
                err ? console.log(err) : console.log(`${newNote.text} now exsists!`)
            })
            res.sendFile(path.join(__dirname, "public/notes.html"))
        })
    }else{
        res.json(err)
        console.log(err + "incomplete info!")
    }

    
})








app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);
