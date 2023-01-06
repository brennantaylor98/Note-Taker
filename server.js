const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');
const uuId = require('./helpers/uuuid');
const { readFromFile, readAndAppend } = require ('./helpers/fsUtils')

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
//  route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


app.get('/api/notes', (req ,res) => {
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uuId(),
    };
  
    if (newNote.title && newNote.text) {
      readAndAppend(newNote, './db/db.json');
      res.json(`new note successfully added `);
    } else {
      console.log('No note added');
    }
  });

  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    // You can access the request body using request.body
    // Here we'll just send a message back in the response
    response.send(`Note with ID ${id} deleted successfully`);
  });
    

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });


app.listen(PORT, () =>
console.log(`app listening at http://localhost:${PORT}`))