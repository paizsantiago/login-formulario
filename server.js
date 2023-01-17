//https://socket.io/docs/v4/server-initialization/
const express = require("express");
const Contenedor = require('./contenedor');
const { createNProducts } = require("./faker");
const { normalizeMessages } = require("./normalizr");
const contenedor = new Contenedor('./products.txt')
const mensajes = new Contenedor('./mensajes.txt')
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

const auth = (req, res, next) => {
  if (req.session?.user === "santi" && req.session?.admin) {
      return next();
  }
  return res.status(401).send("error de autorizacion!");
}


//IMPLEMENTACION
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(8080, () => console.log("SERVER ON http://localhost:" + 8080));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile( __dirname + "/index.html" );
});

app.get("/api/productos-test", (req, res) =>{
  let randomProducts = [];
  createNProducts(randomProducts, 5);
  res.render("productosFaker.pug", {title: "Productos random", products: randomProducts, productsExist: true})
})


io.on("connection", (socket) => {
  //atajo los mensajes
  socket.on("msg", async (data)=>{
    mensajes.save(data);
    const allMsgs = await mensajes.getAll();
    const chatNormalizado = normalizeMessages(allMsgs);
    io.sockets.emit("msg-list", chatNormalizado);
  })

  socket.on("product", (data)=>{
    contenedor.save(data);
    const listProducts = contenedor.getAll();
    io.sockets.emit("product-list", listProducts);
  })

})

//---------SESSION--------------

app.use(session({
  store: MongoStore.create({
      mongoUrl: "mongodb+srv://santiagopaiz:7pUEtOwIzTYvQyOF@cluster0.cpghy3l.mongodb.net/?retryWrites=true&w=majority" ,
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      }
  }),
  secret: "secreto",
  resave: false,
  saveUninitialized: false,
  cookie:{
      maxAge: 600000
  }
}));

app.get('/login', (req, res) =>{
   res.render('login.pug')
})

app.post('/login', (req, res) => {
  const user = req.body.user;
  req.session.user = user;
  res.redirect('/usuarioLogueado')
});

// genere esta vista extra para no tener que cambiar todo el index a pug, esta ruta corresponde a la primer screenshot del pdf

app.get('/usuarioLogueado', (req, res) => {
  const user = req.session.user;
  if (user !== undefined) {
    res.render('usuarioLogueado.pug', {user: user})
  } else {
    res.redirect("/login");
  }
})

app.post('/logout' , (req, res) => {
  const user = req.session.user;
  req.session.destroy((error) =>{
      if (error) {
          res.send("no pudo desloguear")
      } else {
          res.send(`Hasta luego ${user}`);
      }
  })
})

