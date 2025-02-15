// Modelo de Producto con Prototipos

// Función constructora para Producto
function Producto(id, nombre, precio, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.imagen = imagen;
}

// Método para calcular el precio con impuestos (21% de IVA)
Producto.prototype.precioConImpuesto = function() {
  return this.precio * 1.21;
};

// ProductoConDescuento hereda de Producto
function ProductoConDescuento(id, nombre, precio, imagen, descuento) {
  Producto.call(this, id, nombre, precio, imagen);
  this.descuento = descuento;
}

// Herencia de Producto
ProductoConDescuento.prototype = Object.create(Producto.prototype);
ProductoConDescuento.prototype.constructor = ProductoConDescuento;

// Método para calcular el precio con descuento
ProductoConDescuento.prototype.precioConDescuento = function() {
  let descuentoDecimal=this.descuento/100;
  let precioConDescuento=this.precio-(this.precio*descuentoDecimal);
  return precioConDescuento;
};

// Array de productos (puedes usar Producto o ProductoConDescuento)
const productos = [
  new Producto(1, "AANG CON MONO", 19.95, "imagenes/aang.png"),
  new Producto(2, "Katara", 39.95, "imagenes/katara.png"),
  new Producto(3, "TOPH", 39.95, "imagenes/toph.png"),
  new Producto(4, "ZUKO", 8.95, "imagenes/zuko.png"),
  new ProductoConDescuento(5, "IROH", 16.95, "imagenes/iroh.png", 12) // Ejemplo con descuento
];

let rotacionActual = 0;
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener("DOMContentLoaded", () => {
  crearSlides(); // Crea los slides inicialmente
  updateCart(); // Actualiza el carrito en la interfaz
});

// Crear los slides para el carrusel
function crearSlides(filteredProducts = productos) {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";  // Limpiar los slides existentes

  filteredProducts.forEach((producto, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.transform = `rotateY(${index * 72}deg) translateZ(400px)`;

    const frontside = document.createElement("div");
    frontside.className = "frontside";
    frontside.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
      <div>
        <h2>${producto.nombre}</h2>
        <p>$${producto.precio.toFixed(2)}</p>
        ${producto instanceof ProductoConDescuento ? `<p><del>$${producto.precio.toFixed(2)}</del> Ahora por $${producto.precioConDescuento().toFixed(2)}</p>` : ''}
        <button onclick="addToCart(${producto.id})" class="boton-añadir">Añadir al Carrito</button>
      </div>
    `;

    slide.appendChild(frontside);
    slider.appendChild(slide);
  });
}

// Función para rotar el carrusel
function rotateSlider(degrees) {
  rotacionActual += degrees;
  document.getElementById("slider").style.transform = `rotateY(${rotacionActual}deg)`;
}

// Función para añadir productos al carrito
function addToCart(id) {
  const producto = productos.find(p => p.id === id);

  // Buscar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(p => p.id === id);

  if (productoEnCarrito) {
    // Si ya está en el carrito, aumentamos el contador
    productoEnCarrito.cantidad++;
  } else {
    // Si no está en el carrito, lo añadimos con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Actualizamos el carrito en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  updateCart();
}

//Función para vLimpiar el carrito
function vaciarCarrito() {
  // Limpiar el carrito (array vacío)
  carrito = [];

  // Eliminar los datos del carrito de localStorage
  localStorage.removeItem('carrito');

  // Actualizar la interfaz
  updateCart();
}


// Función para disminuir la cantidad de un producto en el carrito
function decreaseQuantity(id) {
  const productoEnCarrito = carrito.find(p => p.id === id);

  if (productoEnCarrito) {
    if (productoEnCarrito.cantidad > 1) {
      productoEnCarrito.cantidad--;
    } else {
      carrito = carrito.filter(p => p.id !== id);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    updateCart();
  }
}

// Mostrar el carrito
function toggleCart() {
  const cart = document.getElementById("cart");
  cart.style.right = cart.style.right === '0px' ? '-400px' : '0px';
}

// Actualizar carrito
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = '';  // Limpiar los items previos del carrito

  let total = 0; // Inicializar el total en 0

  if (carrito.length === 0) {
    cartItems.innerHTML = "<li>El carrito está vacío</li>"; // Mensaje si el carrito está vacío
  }

  carrito.forEach((item) => {
    total += item.precio * item.cantidad; // Sumar precio * cantidad al total

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x${item.cantidad}
      <button onclick="decreaseQuantity(${item.id})" class="boton-delete">-</button>
    `;
    cartItems.appendChild(li);
  });

  // Actualizar el total en la interfaz
  if (cartTotal) {
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}


// Finalizar compra
function checkout() {
  const fecha = new Date();
  alert(`Compra Finalizada!\nFecha: ${fecha.toLocaleString()}\nProductos:\n${carrito.map(item => `${item.nombre} x${item.cantidad}`).join('\n')}`);
  carrito = [];
  localStorage.removeItem('carrito'); // Limpiar el carrito de localStorage
  updateCart();
}

// Función para filtrar los productos según la búsqueda
function filterProducts() {
  const searchInput = document.getElementById("search").value.toLowerCase(); // Obtener el valor de la búsqueda en minúsculas

  // Filtrar los productos que contengan el texto de búsqueda
  const filteredProducts = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchInput) // Compara el nombre del producto en minúsculas
  );

  // Crear los slides con los productos filtrados
  crearSlides(filteredProducts);
}

