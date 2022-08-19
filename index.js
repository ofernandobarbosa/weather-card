//importando bibliotecas
import mongoose from 'mongoose';
import { } from 'dotenv/config';
import fetch from 'node-fetch'; 
import Weather from './models/Weather.js'
import bp from 'body-parser' //import necessário para receber um stringfy com post

//import da framework express
import express from 'express';
const app = express();

//definindo variaveis de ambiente
const key = process.env.KEY;
const port = process.env.PORT;
const __dirname = process.cwd();
const base = process.env.BASE

app.use(express.static('.'));
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))

//rota raiz da aplicação
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/www/index.html')
})

//rota para buscar estado atual do tempo com geolocalização
app.get("/latlon/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const weather_url = `${base}appid=${key}&lat=${lat}&lon=${lon}`; //monta url de request
  const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
  const weather_data = await weather_res.json(); //convert response em um json
  res.json(weather_data); //devolve a response para request
})

app.get("/searchCity/:city", async (req, res) => {
  const city = req.params.city;
  const weather_url = `${base}appid=${key}&q=${city}`; //monta url de request
  const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
  const weather_data = await weather_res.json(); //convert response em um json
  res.json(weather_data); //devolve a response para request
})


main().catch(err => console.log(err));

//prioriza e cria a conexão com o banco de dados, e após abre a porta para o listen
async function main() {
  await mongoose.connect(process.env.URI_MONGO_ATLAS)
    .then(() => {
      app.listen(port, () => {
        console.log("follow http://localhost:" + port)
      })
    })
}

//inserer dados no banco
app.post('/db/', async (req, res) => {
  const { icon, weatherDescription, temp, measureUnit, windSpeed, humidity, searchedCity, time } = req.body

  const weather = {
    searchedCity,
    icon,
    weatherDescription,
    temp,
    measureUnit,
    windSpeed,
    time,
    humidity
  }
  // console.log(weather)
  try {
    await Weather.create(weather)
    res.status(201).json({ message: 'Current weather insert on system' })
  } catch (error) {
    req.statusCode(500).json({ error: error })
  }
})

//busca todos os dados do banco
app.get('/list', async(req,res) =>{
  try {
    const weather = await Weather.find();
    res.status(200).json(weather)
  } catch (error) {
    res.status(500).json({error: error})
  }
})