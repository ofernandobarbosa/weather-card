import { Router } from 'express'
import fetch from 'node-fetch';
const router = Router();
const key = process.env.KEY;
const base = process.env.BASE;
const base_week = process.env.BASE_WEEK


//rota raiz da aplicação
router.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  })
  
//rota para buscar estado atual do tempo com geolocalização
router.get("/latlon/:latlon", async (req, res) => {
    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const weather_url = `${base}appid=${key}&lat=${lat}&lon=${lon}`; //monta url de request
    const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
    const weather_data = await weather_res.json(); //convert response em um json
    res.json(weather_data); //devolve a response para request
  })
  
  router.get("/searchCity/:cidade", async (req, res) => {
    const city = req.params.cidade;
    const weather_url = `${base}appid=${key}&q=${city}`; //monta url de request
    const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
    const weather_data = await weather_res.json(); //convert response em um json
    res.json(weather_data); //devolve a response para request
  })
  
  // //rota para buscar tempo de uma semana com geolocalização 
  // router.get("/latlonWeek/:latlon", async (req, res) => {
  //     const latlon = req.params.latlon.split(',');
  //     const lat = latlon[0];
  //     const lon = latlon[1];
  //     const weather_url = `${base}appid=${key}&lat=${lat}&lon=${lon}`; //monta url de request
  //     const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
  //     const weather_data = await weather_res.json(); //convert response em um json
  //     res.json(weather_data); //devolve a response para request
  //   })
  // // rota para buscar tempo de uma semana com input
  // router.get("/searchCityWeek/:cidade", async (req, res) => {
  //   const city = req.params.cidade;
  //   const weather_url = `${base_week}appid=${key}&q=${city}`; //monta url de request
  //   const weather_res = await fetch(weather_url); //recebe uma promisse da fetch
  //   const weather_data = await weather_res.json(); //convert response em um json
  //   res.json(weather_data); //devolve a response para request
  // })
  
  export default router