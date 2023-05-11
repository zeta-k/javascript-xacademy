/*
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
*/

// Cada producto que vende el super es creado con esta clase
class Producto {
  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock ?? 10; // establece un valor prederterminado de stock de 10 sino se encuentra 
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

/// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }

  /**
   * función que agrega @{cantidad} de productos con @{sku} al carrito
   */
  async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);

    // Busco el producto en la "base de datos"
    const producto = await findProductBySku(sku);

    console.log("Producto encontrado", producto);

    // bucar producto si esta en el carrito con find()
    const productoExistenteIndex = this.productos.findIndex(
      (p) => p.sku === sku
    );
    if (productoExistenteIndex !== -1) {
      // si esta el producto se actualiza
      this.productos[productoExistenteIndex].cantidad += cantidad;
    } else {
      // si no se encuentra, creo el producto nuevo
      const nuevoProducto = new ProductoEnCarrito(
        sku,
        producto.nombre,
        cantidad
      );
      this.productos.push(nuevoProducto);
    }

    // verifica si se encuenrtra en la lista de categorias
    if (!this.categorias.includes(producto.categoria)) {
      this.categorias.push(producto.categoria);
    }

    // multiplica precio unitario por cantidad 
    this.precioTotal += producto.precio * cantidad;
    console.log("Precio total: " + this.precioTotal);
  }

  /**
   * Función que elimina @{cantidad} de productos con @{sku} del carrito
   */
  async eliminarProducto(sku, cantidad) {
    try {
      // Busco si el producto ya existe en el carrito con findIndex()
      const productoExistenteIndex = this.productos.findIndex(
        (p) => p.sku === sku
      );

      // Si el producto no existe en el carrito, muestro un mensaje de error y rechazo la promesa
      if (productoExistenteIndex === -1) {
        throw new Error(`El producto con SKU ${sku} no existe en el carrito`);
      }

      // Si el producto existe en el carrito, actualizo la cantidad o lo elimino según corresponda
      console.log("");
      console.log(`Eliminado el producto SKU ${sku} cantidad: ${cantidad}`);
      const productoExistente = this.productos[productoExistenteIndex];
      if (cantidad < productoExistente.cantidad) {
        productoExistente.cantidad -= cantidad;
        console.log("Eliminado exitosamente!");
      } else {
        this.productos.splice(productoExistenteIndex, 1);
      }

      // se actualiza el total
      const producto = await findProductBySku(sku);
      this.precioTotal -= producto.precio * cantidad;
      console.log("Precio Total: " + this.precioTotal);

      // Resuelvo la promesa
      return Promise.resolve();
    } catch (error) {
      // si encuentra un error rechaza la promesa
      return Promise.reject(error);
    }
  }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
        console.log("");
      } else {
        reject(`ERROR: el Producto: ${sku} no esta en la base de datos`);
      }
    }, 1500);
  });
}

const carrito = new Carrito();
carrito.agregarProducto("FN312PPE", 2);
carrito.agregarProducto("PV332MJ", 5);
carrito.agregarProducto("WE328NJ", 3).then(() => {
  return carrito.eliminarProducto("WE328NJ", 2);
});
carrito.agregarProducto("RT324GD", 4);
