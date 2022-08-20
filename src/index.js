//importando bibliotecas
import { } from 'dotenv/config';
import bp from 'body-parser' //import necessário para receber um stringfy com post
import cors from 'cors';
import routes from './routes.js'

//import da framework express
import express from 'express';
const app = express();
const port = process.env.PORT;

//definindo variaveis de ambiente
const __dirname = process.cwd();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(routes)

app.listen(port, () =>{
  console.log(`follow http://localhost:${port}`)
})

