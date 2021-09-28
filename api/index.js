const express = require('express');
const csv = require('csvtojson')
const cors = require('cors');
const merge = require('lodash/merge');

const app = express();
const port = 8888;

const main = '../dati/main.csv'
const pop = '../dati/popolazione_2021.csv'

const getData = (f) => {
    let file = csv().fromFile(f)
    return file
}

const getAll = async() => {
    const m = await getData(main)
    const p = await getData(pop)
    let final = merge(m, p)
    return final
}

const getComune = async(comune) =>{
    const data = await getAll()
    let place = data.filter(x => x.pro_com_t === comune)
    return place[0]
}

app.use(cors({ origin: '*' }));

// Home
app.get('/', (req, res) => {
    res.send('Benvenuti');
});

// Tutti i comuni
app.get('/comuni', async (req, res) => {
    try {
        const data = await getAll()
        res.send(data)
    }
    catch(e){
        console.log(e);
        res.sendStatus(e);
    }
})

// Comuni per codice ISTAT
app.get('/comuni/:istat', async (req, res) => {
    try {
        const data = await getComune(req.params.istat)
        res.send(data)
    }
    catch(e){
        console.log(e)
    }
});

app.listen(port, () => console.log(`Serving https://localhost:${port}`))