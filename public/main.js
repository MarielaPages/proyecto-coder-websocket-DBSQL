const socket = io();

const button = document.getElementById('button');
const title = document.getElementById('title');
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnail')

button.addEventListener("click", (e) => {
    e.preventDefault();
    const newProduct = {title: title.value, price: price.value, thumbnail: thumbnail.value}
    socket.emit("newProduct", newProduct);
    title.value = ''
    price.value = '';
    thumbnail.value = ''
})

let tableContainer = document.getElementById('tableContainer')
let tableBody = document.getElementById("tbody")

socket.on('productosEnviados', productos =>{
    if(productos.length>0){
        tableBody.innerHTML = productos.map(product => {
            return(`<tr>
                    <td> ${product.title} </td>
                    <td> ${product.price} </td>
                    <td>
                        <img src="${product.thumbnail}" alt="${product.title}" class="imgProd"> <!--El src lo va a ir a buscar a public porque alli declare que estan mis archivos estaticos-->
                    </td>
                    </tr>`)
        }).join('');               
    }
    else{
        tableContainer.innerHTML = `<p class="text-center">There are no products</p>`
    }
})

const button2 = document.getElementById('button2')
const email = document.getElementById('email')
const message = document.getElementById('message')

button2.addEventListener("click", () => {
    const d = new Date();
    const day = d.getDay()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const hour = d.getHours()
    const minutes = d.getMinutes()
    const second = d.getMilliseconds()
    const date = `${day}/${month}/${year} ${hour}:${minutes}:${second}`
    const personMessage = {email: email.value, fecha: date , message: message.value}
    socket.emit("newMessage", personMessage)
    button2.value = ''
    email.value=''
    message.value=''
})

const messagesContainer = document.getElementById("messagesContainer")

socket.on('mensajesEnviados', mensajes =>{
    messagesContainer.classList.add("mensajesContainerStyles")
    if(mensajes.length>0){
        messagesContainer.innerHTML = mensajes.map(mensaje => {
            return(`<p><span class="mail">${mensaje.email} </span>
                <span class="fecha">[${mensaje.fecha}]: </span>
                <span class="msj">${mensaje.message}</span></p>`)
        }).join(' ');
    }
    else{
        messagesContainer.innerHTML = ''
        messagesContainer.classList.remove("mensajesContainerStyles")
    }
})

