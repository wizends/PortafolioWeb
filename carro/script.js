//API Siglo XXI////////////////////////----------------------------------------

const contenedorProducto = document.getElementById("contenedorProducto");

const IdMesa = '5M'
let carrito = {}
let cliente

function getRandom() {
  return Math.floor(Math.random()*101)
}

const hoy = new Date();	
const hora = hoy.getHours() + ':' + hoy.getMinutes()

const API_URL = "http://localhost:3000";

const option = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },

};
fetch(`${API_URL}/products`, option)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    pintarProductos(data)
    detectarBotones(data)
  });

const optionCliente = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({IdMesa})
}
fetch(`${API_URL}/cliente-mesa`, optionCliente)
.then((response) => response.json())
  .then((data) =>{
    cliente = data
  })

////


const contendorProductos = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
  const template = document.querySelector('#template-productos').content
  const fragment = document.createDocumentFragment()
  // console.log(template)
  data.forEach(producto => {
      // console.log(producto)
      template.querySelector('h5').textContent = producto.nombre
      template.querySelector('p span').textContent = producto.precio
      template.querySelector('button').dataset.id = producto.id
      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
  })
  contendorProductos.appendChild(fragment)
}





const detectarBotones = (data) => {
  const botones = document.querySelectorAll('.card button')

  botones.forEach(btn => {
      btn.addEventListener('click', () => {
          //console.log(parseInt(btn.dataset.id))
          const producto = data.find(item => parseInt(item.id) === parseInt(btn.dataset.id))
          //console.log(producto)
          producto.cantidad = 1
          if (carrito.hasOwnProperty(producto.id)) {
              producto.cantidad = carrito[producto.id].cantidad + 1
          }
          carrito[producto.id] = { ...producto }
          // console.log('carrito', carrito)

          pintarCarrito()    
      })
  })
}

const items = document.querySelector('#items')

const pintarCarrito = () => {
  items.innerHTML = ''
  const template = document.querySelector('#template-carrito').content
  const fragment = document.createDocumentFragment()

  Object.values(carrito).forEach(producto => {
      // console.log('producto', producto)
      template.querySelector('th').textContent = producto.id
      template.querySelectorAll('td')[0].textContent = producto.nombre
      template.querySelectorAll('td')[1].textContent = producto.cantidad
      template.querySelector('span').textContent = producto.precio * producto.cantidad

      //botones
      template.querySelector('.btn-info').dataset.id = producto.id
      template.querySelector('.btn-danger').dataset.id = producto.id

      
      const clone = template.cloneNode(true)
      fragment.appendChild(clone)


      
  })

  items.appendChild(fragment)

  pintarFooter()
  accionBotones()
  

}



const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {
  

  footer.innerHTML = ''

  if (Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
      `
      return
  }

  const template = document.querySelector('#template-footer').content
  const fragment = document.createDocumentFragment()


  

  // sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
 
  // console.log(nPrecio)

  template.querySelectorAll('td')[0].textContent = nCantidad
  template.querySelector('span').textContent = nPrecio

  const clone = template.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)


  const boton = document.querySelector('#vaciar-carrito')
  boton.addEventListener('click', () => {
      carrito = {}
      pintarCarrito()
  })

const pedido = [];

const mercadopago = new MercadoPago('TEST-3c8fc6cf-402e-4b8d-b040-5a40d898041a', {
  locale: 'en-US' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});
const pagarPedido = document.getElementById("pagarPedido")

      pagarPedido.addEventListener('click', (e) =>{
        $('#checkout-btn').attr("disabled", true);
        
    
        const pago = {
          cantidad: 1,
          precio: parseInt(document.getElementById("total").innerHTML)
        };
        console.log(pago)
        fetch(`${API_URL}/create_preference`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(pago),
        })
          .then(function(response) {
              return response.json();
          })
          .then(function(preference) {
            createCheckoutButton(preference.id);
            
            $(".shopping-cart").fadeOut(500);
            setTimeout(() => {
                $(".container_payment").show(500).fadeIn();
            }, 500);
        })
        .catch(function() {
            alert("Unexpected error");
            $('#checkout-btn').attr("disabled", false);
        });
        
      });
      function createCheckoutButton(preferenceId) {
        // Initialize the checkout
        mercadopago.checkout({
          preference: {
            id: preferenceId
          },
          render: {
            container: '#button-checkout', // Class name where the payment button will be displayed
            label: 'Pay', // Change the payment button text (optional)
          }
        });
      }

      const pagarGarzon = document.getElementById("pagarGarzon")
      pagarGarzon.addEventListener("click", (e) => {
        
        alert("Paga $"+ parseInt(document.getElementById("total").innerHTML)+ " "+"al garzon")
        location.reload();
      })
      const totalMP = document.getElementById("summary-total")
      totalMP.innerHTML ="$"+ parseInt(document.getElementById("total").innerHTML)
      document.getElementById("go-back").addEventListener("click", function() {
        $(".container_payment").fadeOut(500);
        setTimeout(() => {
            $(".shopping-cart").show(500).fadeIn();
        }, 500);
        $('#checkout-btn').attr("disabled", false);  
      });



  //Aqui se hace el pedido y lo manda con POST a la API
  const hacerPedido = document.getElementById('hacerPedido')
      hacerPedido.addEventListener('click', async () => {
        const orden = Object.values(carrito)
        const orden2 = []
        orden.forEach(e => {
          orden2.push(e.nombre + "("+e.cantidad+")")
        })
        console.log(orden2)
        const optionOrden = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: getRandom(),
            hora:hora,
            producto:orden2.toString(),
            idCliente:cliente[0]
          })
        }
        fetch(`${API_URL}/pedido`, optionOrden)
        .then((response) => response.json())
          .then((data) =>{
            alert(data)
          });
  });

      
}

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll('#items .btn-info')
  const botonesEliminar = document.querySelectorAll('#items .btn-danger')

  // console.log(botonesAgregar)

  botonesAgregar.forEach(btn => {
      btn.addEventListener('click', () => {
          const producto = carrito[btn.dataset.id]
          producto.cantidad ++
          carrito[btn.dataset.id] = { ...producto }   
          pintarCarrito()
      })
  })

  botonesEliminar.forEach(btn => {
      btn.addEventListener('click', () => {
          // console.log('eliminando...')
          const producto = carrito[btn.dataset.id]
          producto.cantidad--
          if (producto.cantidad === 0) {
              delete carrito[btn.dataset.id]
          } else {
              carrito[btn.dataset.id] = { ...producto }
          }
          pintarCarrito()
      })
  })
}


// let carritoEjemplo = {}
// carritoEjemplo = {
//     1: {id: 1, titulo: 'cafe', precio: 500, cantidad: 3},
//     2: {id: 3, titulo: 'pizza', precio: 100, cantidad: 2},
// }

// console.log(carritoEjemplo[1])

