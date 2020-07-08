//
//

let sheetBestAPI = "https://sheet.best/api/sheets/0ae52285-ba6f-433c-a34e-030e895d68f9";

// Inicializar la orden y el monto total
order = [];
total = 0;

// Cargar elementos de la cabecera desde la API
fetch(sheetBestAPI + '/tabs/Info')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data[0].Logo);
    document.getElementById("site-header").innerHTML +=
      "<img height='100' width='100' alt='Logo de " +
      data[0].Nombre + "' src='" +
      data[0].Logo +
      "'/><h1>" +
      data[0].Nombre + "</h1><h3>" +
      data[0].Descripcion + "</h3><input id='wpp' value='" +
      data[0].WhatsApp + "' /><div id='instructions'>" +
      data[0].Instrucciones + "</div><a target='_blank' href='https://api.whatsapp.com/send?phone=549" +
      data[0].WhatsApp + "' id='link-wpp'><svg viewBox='0 0 10.79 10.79' xmlns='http://www.w3.org/2000/svg'><path d='M10.79 5.12A5.3 5.3 0 00.2 5v.23A5.12 5.12 0 001 8l-1 2.79 2.93-.93a5.31 5.31 0 007.86-4.6zm-5.3 4.56A4.49 4.49 0 013 9l-1.71.54.56-1.64A4.41 4.41 0 011 5.26v-.43a4.46 4.46 0 018.87.08v.35a4.45 4.45 0 01-4.38 4.42zm2.6-2.6a1.27 1.27 0 01-.87.61c-.24 0-.24.2-1.56-.32a5.29 5.29 0 01-2.22-1.94 3 3 0 01-.44-.9 1.62 1.62 0 01-.07-.44A1.47 1.47 0 013.36 3a.48.48 0 01.35-.16H4c.08 0 .18-.05.29.21s.37.9.4 1a.23.23 0 010 .23l-.08.15v.06a2.33 2.33 0 01-.19.23.18.18 0 00-.14.28 4.11 4.11 0 00.72.86 3.48 3.48 0 001 .64.2.2 0 00.28 0c.08-.09.32-.38.41-.51s.17-.1.29-.06.76.35.89.42.22.09.25.15a1.09 1.09 0 01-.03.58z' fill=#fff'></path></svg></a>";
  });

// Consulto la API con fetch y guardo el json en data
fetch(sheetBestAPI + '/tabs/Productos')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    data.forEach(function(item, i) {
      // 📝 Cargo la orden vacía
      order.push({
        product: item.Producto,
        cant: 0,
        price: item.Precio
      });

      // Listado de productos
      document.getElementById("products").innerHTML +=
        "<div class='product'><div class='product_image'><img src='" +
        item.Foto +
        "'/></div><div class='productData'><h3>" +
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

    document.body.classList.add("loaded");
  });

// Cambiar el texto del botón Agregar a Agregar 1 más
function changeBtnText(cod, cant) {
  if (cant == 0) {
    document.getElementById("products").childNodes[cod + 1].lastChild.childNodes[2].childNodes[1].childNodes[0].classList.add("notVisible");
    document.getElementById("products").childNodes[cod + 1].lastChild.childNodes[2].childNodes[1].childNodes[1].innerHTML = "Agregar";
  } else {
    document.getElementById("products").childNodes[cod + 1].lastChild.childNodes[2].childNodes[1].childNodes[0].classList.remove("notVisible");
    document.getElementById("products").childNodes[cod + 1].lastChild.childNodes[2].childNodes[1].childNodes[1].innerHTML = "Agregar 1 más";
  }
}

// Animación del monto total cuando se agrega un nuevo producto
// al pedido
function animateTotal() {
  var precio1 = document.getElementById("totalPricePreview");
  precio1.classList.remove("animate");
  void precio1.offsetWidth;
  precio1.classList.add("animate");
  var precio2 = document.getElementById("totalPrice");
  precio2.classList.remove("animate");
  void precio2.offsetWidth;
  precio2.classList.add("animate");
}

// Agregar un producto al pedido
function addProduct(cod) {
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
  //document.getElementById("purchase").innerHTML = "¡Gracias!";
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