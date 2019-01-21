const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use('/public', express.static('public')); 

const spirits = require('./routes/spirits')

app.use('/api/spirits', spirits)


app.get('/', (req, res) => {
    res.send("API esprits")
})

const port = process.env.PORT || 8888;
app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }
    console.log(`Server SSBU est écouté sur le port ${port}`);
});

module.exports = app;

