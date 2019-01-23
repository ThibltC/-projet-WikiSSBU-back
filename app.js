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
const series = require('./routes/series')
const skills = require('./routes/skills')

app.use('/api/spirits', spirits)
app.use('/api/series', series)
app.use('/api/skills', skills)

app.get('/', (req, res) => {
    res.status(200).send("API SSBU")
})

const port = process.env.PORT || 8888;
app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }
    console.log(`Server SSBU is listening on ${port}`);
});

module.exports = app;

