//
//

// Inicializar la orden y el monto total
order = [];
total = 0;

function successFunc(data) {
  data.forEach(function(item, i) {
    // 📝 Cargo la orden vacía
    order.push({
      product: item.Producto,
      cant: 0,
      price: item.Precio
    });

    // Listado de productos
    document.getElementById("products").innerHTML +=
      "<div class='product'><img src='" +
      item.Foto +
      "'/><div class='productData'><h3>" +
      item.Producto +
      "</h3><p>" +
      item.Descripcion +
      "</p><div class='footer'><span class='price'>$" +
      item.Precio +
      "</span><div class='actions'><button class='remove notVisible' onclick='removeProduct(" +
      i +
      ")' data-cod='" +
      i +
      "'><svg viewBox='0 0 24 24'><g><rect height='4' width='20' x='2' y='10'></rect></g></svg></button><button onclick='addProduct(" +
      i +
      ")' class='add' data-cod='" +
      i +
      "'>Agregar</button></div></div></div></div>";
  });
}

Sheetsu.read(
  "https://sheetsu.com/apis/v1.0su/0e7413429ae0/sheets/Productos", {},
  successFunc
);

// Cambiar el texto del botón Agregar a Agregar 1 más
function changeBtnText(cod, cant) {
  if (cant == 0) {
    document.getElementById("products").childNodes[
      cod
    ].lastChild.childNodes[2].childNodes[1].childNodes[0].classList.add("notVisible");
    document.getElementById("products").childNodes[
      cod
    ].lastChild.childNodes[2].childNodes[1].childNodes[1].innerHTML = "Agregar";
  } else {
    document.getElementById("products").childNodes[
      cod
    ].lastChild.childNodes[2].childNodes[1].childNodes[0].classList.remove("notVisible");
    document.getElementById("products").childNodes[
      cod
    ].lastChild.childNodes[2].childNodes[1].childNodes[1].innerHTML = "Agregar 1 más";
  }
}

// Animación del monto total cuando se agrega un nuevo producto
// al pedido
function animateTotal() {
  var element = document.getElementById("totalPricePreview");
  element.classList.remove("animate");
  void element.offsetWidth; // trigger a DOM reflow
  element.classList.add("animate");
}

// Agregar un producto al pedido
function addProduct(cod, text) {
  order[cod].cant += 1;
  changeBtnText(cod, order[cod].cant);
  refreshOrder();
  animateTotal();
}

// Eliminar un producto del pedido
function removeProduct(cod) {
  order[cod].cant -= 1;
  changeBtnText(cod, order[cod].cant);
  refreshOrder();
  animateTotal();
}

// Enviar pedido
function sendOrder() {
  // Obtengo el número de WhatsApp
  wppNumber = document.getElementById("wpp").value;
  // Empiezo a crear el string del link
  link =
    "https://api.whatsapp.com/send?phone=549" +
    wppNumber +
    "&text=¡Hola! Te quiero hacer un pedido%0a";
  // Concatenar productos y cantidades
  for (let item of order) {
    if (item.cant > 0) {
      link += item.product + "  x" + item.cant + "%0a";
    }
  }
  // Concatenar monto total
  link += "Total:  $" + total;
  // Datos extra
  link += "%0aMi nombre es %0aMi dirección es ";
  window.open(link);
}

// Actualizar pedido (productos, cantidades, monto total)
function refreshOrder() {
  // Vaciar orden
  document.getElementById("orderList").innerHTML = "";
  document.getElementById("totalPrice").innerHTML = "";
  document.getElementById("totalPricePreview").innerHTML = "";
  i = 0;
  total = 0;
  for (let item of order) {
    // Incluir producto en la orden si cantidad es mayor a cero
    if (item.cant > 0) {

      removeSymbol = "<svg viewBox='0 0 24 24'><g><rect height='4' width='20' x='2' y='10'></rect></g></svg>";

      document.getElementById("orderList").innerHTML +=
        "<li><span>" +
        item.product +
        "</span><div class='quant'><button class='remove' onclick='removeProduct(" +
        i +
        ")'>" +
        removeSymbol +
        "</button><span>" +
        item.cant +
        "</span><button class='add' onclick='addProduct(" +
        i +
        ")'>+</button></div><span class='subTotal'>$" +
        item.cant * item.price +
        "</span></li>";
    }
    // Calcular monto total
    total += item.cant * item.price;
    i += 1;
  }
  document.getElementById("totalPrice").innerHTML = "$" + total;
  document.getElementById("totalPricePreview").innerHTML = "$" + total;
  // Habilitar botón Ver pedido
  if (total == 0) {
    document.getElementById("purchase").disabled = true;
    document.getElementById('order').classList.remove('visible');
    document.getElementById("showOrder").classList.remove("visible");
  } else {
    document.getElementById("purchase").disabled = false;
    document.getElementById("showOrder").classList.add("visible");
  }
}

window.onload = refreshOrder();