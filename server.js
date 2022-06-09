const express = require("express");
const app = express();
const {Server : ioServer} = require('socket.io')
const http = require('http')
const Contenedor = require("./contenedor");
const knex = require("knex");
const options = require('./src/ecommerce/configDB')

// const createTables = async () => {
//   try{
//     await knex(options.mariaDB).schema.createTable('productos', table => {
//       table.increments('id').primary().unique()
//       table.varchar('title').notNullable()
//       table.float('price').notNullable()
//       table.varchar('thumbnail').notNullable()
//     });
//     await knex(options.sqlite).schema.createTable('mensajes', table => {
//       table.increments('id').primary().unique()
//       table.varchar('email').notNullable()
//       table.varchar('fecha').notNullable()
//       table.varchar('message').notNullable()
//     });
//   }
//   catch(err){
//     console.log(err.name, err.message);
//   }
// }

// createTables()

const archivoNuevo = new Contenedor(options.mariaDB, 'productos');
const mensajesLlegados = new Contenedor(options.sqlite, 'mensajes')

//Creo los servidores
const httpServer = http.createServer(app)
const io = new ioServer(httpServer) 

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));

//Rutas
app.get("/", async (req, resp) => {
  const productos = await archivoNuevo.getAll();
  resp.render('pages/index', {productos: productos}) // lo busca en views
})


//Le digo donde van a estar mis templates y prendo el motor
app.set('views', './views') // este no es necesario??
app.set('view engine', 'ejs')


let messages = []
let productos = []

async function devolverMensajes(){
  messages = await mensajesLlegados.getAll()
  io.sockets.emit('mensajesEnviados', messages)
}

async function devolverProds(){
  productos = await archivoNuevo.getAll()
  io.sockets.emit('productosEnviados', productos)
} 

//Levanto el servidor io
io.on('connection', socket => {
  console.log("cliente conectado")
  
  devolverProds()
  socket.on('newProduct', async (product) =>{
    await archivoNuevo.save(product);
    productos = await archivoNuevo.getAll()
    io.sockets.emit('productosEnviados', productos);
  })

  devolverMensajes()
  socket.on('newMessage', async data =>{
    await mensajesLlegados.save(data)
    messages = await mensajesLlegados.getAll()
    io.sockets.emit('mensajesEnviados', messages)
  })
});

//empiezo el server
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});

server.on('error', error => console.log(`Error en el servidor ${error}`))