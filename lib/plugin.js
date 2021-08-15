const express = require('express');
const app = express();
const util = require('./util');
const port = 8080;

app.use(express.json());

app.get('/status', (req, resp) => {

    resp.send('OK');
});

app.post('/subtraction', (req, resp) => {
    const mcqs = util.generateQuestions(req.body.numOfQ, req.body.minuendDigit, req.body.subtrahendDigit, req.body.borrowing);
    
    resp.send(mcqs);
})

app.listen(port, () => {
    console.log(`server started on port: ${port}`);
})

