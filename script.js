let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{

  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');

}


function loader(){
  document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
  setInterval(loader, 3000);
}


const formnularioReserva = document.getElementById("formnularioReserva");
const nombre = document.getElementById("nombre")
const telefono = document.getElementById("telefono")
const email = document.getElementById("email")
const fecha = document.getElementById("fecha")
const hora = document.getElementById("hora")
const numero = document.getElementById("numero")
const lugar = document.getElementById("lugar")
const rut = document.getElementById("rut")
const apellido = document.getElementById("apellido")


//Comienzo de la API siglo XXI

const API_URL = 'http://localhost:3000';


let i = 0;
let iCliente = 0;
let mesaIdApi = "";

function getRandom() {
  return Math.floor(Math.random()*101)
}

formnularioReserva.addEventListener("submit", (e) =>{
  //const data = { hola:"Hola" , como:"Como estas" };// Aqui se pueden ingresar los datos a enviar
  e.preventDefault()
  i = i++
  iCliente = iCliente++
  const data = {
    nombre: nombre.value,
    apellido: apellido.value,
    rut: rut.value,
    telefono: telefono.value,
    email: email.value,
    fechaHora: fecha.value + " " + hora.value,
    cantidadPersonas: numero.value,
    tipoMesa: lugar.value,
    //ids
    idReserva: getRandom(),
    clienteId: getRandom(),
    mesaId: mesaIdApi//obtenido desde la API
  }
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  fetch(`${API_URL}/agregarReserva`, options)
  .then(response => response.json())
  .then(data =>{
    alert(data)
  })
  
})

lugar.addEventListener('change', async (e)=>{
  const data = {
    tipoMesa: lugar.value,
    cantidadPersonas: numero.value
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    
  };
  fetch(`${API_URL}/fromoracle`, options)
  .then(response => response.json())
  .then(data =>{ 
    console.log(data);
    
    mesaIdApi = data.mesa[0];
    console.log(mesaIdApi)
    
  });
  
})






