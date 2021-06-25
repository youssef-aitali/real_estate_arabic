const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Geojson = require('geojson');
const knex = require('knex');

const postgres = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1994',
      database : 'real_estate'
    }
});

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/parcels', (req, res) => {

      postgres.select('*').from('parcels')
      .then(parcels => {
        res.send(Geojson.parse(parcels, {Polygon: 'geometry', exclude: ['geom']}));
      })
      .catch(err => res.status(400).json('error getting parcels'));

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

 