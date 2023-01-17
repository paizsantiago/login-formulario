

const socket = io();

const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
const normalize = normalizr.normalize;

const authorSchema = new schema.Entity("authors");
const messageSchema = new schema.Entity("messages",{
    author: authorSchema,
});

const messagesListSchema = new schema.Entity("messagesList",{
    messages: [messageSchema],
});

socket.on("connect", () => {
});



socket.on("msg-list",  (data) => {
  const chatDenormalize = denormalize(data.result, messagesListSchema, data.entities);
  let html = '';
  chatDenormalize.messages.forEach(item => {
    html +=  item.author.id + " " + item.timestamp + ' : ' + `<img src=${item.author.avatar} class="avatar">` + item.content  + '<br><br>';
  });
  document.getElementById('msg-list-div').innerHTML = html;
});

socket.on("product-list", (data) => {
  let html = '';
  data.forEach(item => {
    html +=  `Nombre de producto: ${item.titulo}, precio: ${item.precio} <img class="img-producto" src=${item.thumbnail}> <br><br>` 
  });
  document.getElementById('product-list-div').innerHTML = html;
});

const enviarMsg = () => {
  const today = new Date();
  const timestamp = today.toLocaleString();
  const content = document.getElementById("content").value;
  const id = document.getElementById("email").value;
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const edad = document.getElementById("edad").value;
  const alias = document.getElementById("alias").value;
  const avatar = document.getElementById("avatar").value;
  socket.emit("msg", {
    author: {
      id,
      nombre,
      apellido,
      edad,
      alias,
      avatar,
    },
    timestamp,
    content,
  });
};

const enviarProducto = () =>{
  const titulo = document.getElementById("titulo").value;
  const precio = document.getElementById("precio").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const newProduct = {titulo: titulo, precio: precio, thumbnail: thumbnail};
  socket.emit('product', newProduct);
}
