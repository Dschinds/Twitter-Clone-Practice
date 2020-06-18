const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk('localhost/meower');
const mews = db.get('mews');

app.use(cors());
app.use(express.json());


const filter = new Filter();

function isValidMew(mew){
    return mew.name && mew.name.toString().trim() !== '' &&
        mew.content && mew.content.toString().trim() !== ''
}
app.get('/', (req, res) => {
    res.json({
        name: 'Lione',
        message: 'Meower! 😽!'
    })
});
app.get('/mews', (req, res) => {
    mews
    .find()
    .then(mew => {
        res.json(mew);
    })
});
app.use(rateLimit({
    windowMs: 30 * 1000,
    max: 1
}));
app.post('/mews', (req, res) => {
    if(isValidMew(req.body)){
        //Insert into db...
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        mews
        .insert(mew)
        .then(createdMew => {
            res.json(createdMew);
        });
    }
    else {
        res.status(422);
        res.json({
            message: 'Proper name and content are required'
        });
    }
});

app.listen(5000, () => {
    console.log('Listening on localhost:5000');
})