let total;

function precioEnvio(tipoEnvio, costoEnvio, subtotal) {
  if (tipoEnvio === "15") {
    costoEnvio = subtotal * 0.15; // Premium 2 a 5 días (15%)
  } else if (tipoEnvio === "7") {
    costoEnvio = subtotal * 0.07; // Estándar 5 a 8 días (7%)
  } else if (tipoEnvio === "5") {
    costoEnvio = subtotal * 0.05; // Básico 12 a 15 días (5%)
  } else {
    costoEnvio = 0; // Valor por defecto si no hay tipo de envío seleccionado
  }
  return costoEnvio;
}
document.addEventListener("DOMContentLoaded", function () {
  let cartContainer = document.getElementById("cart-body"); // Contenerdor del carrito
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

   // fncion para actualizar el subtotal y el importe total
   function updateTotals() {
    let totalAmount = 0;
    cart.forEach((product) => {
      let price = parseFloat(product.price) || 0;
      let quantity = parseInt(product.quantity) || 0;
      totalAmount += price * quantity;
    });

    let tipoEnvio = localStorage.getItem("tipoEnvioElegido") || "15";
    if (!tipoEnvio) {
      tipoEnvio = "15"; // Valor por defecto
      localStorage.setItem("tipoEnvioElegido", tipoEnvio);
    }

    document.getElementById("total-amount").textContent = `$${(
      totalAmount 
    ).toFixed(2)}`;

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateFinalTotal() {
    // Recalcular subtotal
    let subtotal = cart.reduce(
      (acc, product) =>
        acc +
        (parseFloat(product.price) || 0) * (parseInt(product.quantity) || 1),
      0
    );

    let tipoEnvio = localStorage.getItem("tipoEnvioElegido") || "15";

    let costoEnvio = precioEnvio(tipoEnvio, 0, subtotal);

    total = subtotal + costoEnvio;

    if (document.getElementById("subtotal-amount")) {
      document.getElementById(
        "subtotal-amount"
      ).textContent = `$${subtotal.toFixed(2)}`;
    }
    if (document.getElementById("shipping-cost")) {
      document.getElementById(
        "shipping-cost"
      ).textContent = `$${costoEnvio.toFixed(2)}`;
    }
    if (document.getElementById("final-total")) {
      document.getElementById("final-total").textContent = `$${total.toFixed(
        2
      )}`;
    }
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
  } else {
    cart.forEach((product, index) => {
      let price = parseFloat(product.price) || 0;
      let quantity = parseInt(product.quantity) || 1;
      let productCard = document.createElement("div");
      productCard.classList.add("card", "mb-4");
      productCard.dataset.index = index;
      productCard.innerHTML = `
        <div class="row g-0 align-items-center ">
          <div class="col-3">
            <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
          </div>
          <div class="col-9">
            <div class="d-flex flex-column ms-4">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">${product.name}</h5>
                <div class="quantity-wrapper">
                  <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                  <input type="text" class="quantity-input" value="${quantity}" readonly>
                  <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                </div>
                <div class="d-flex align-items-center">
                  <span class="me-3">$${price.toFixed(2)}</span>
                  <button class="delete-btn" data-index="${index}">Eliminar</button>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <p class="card-text text-muted mb-0 me-5 mt-3" style="flex: 1;">${product.description}</p>
                <p class="text-center mt-4" style="min-width: 120px;"><span>Subtotal:</span> <br> $<span class="product-subtotal">${(
          price * quantity
        ).toFixed(2)}</span></p>
              </div>
            </div>
          </div>
        </div>
      `;
      cartContainer.appendChild(productCard);
    });

    let badge = document.getElementById("cant-cart");
    badge.innerHTML = `${cart.length}`;

    // Crear el contenedor de importe total dentro del contenedor de productos
    let totalContainer = document.createElement("div");
    totalContainer.classList.add("total-container");
    totalContainer.innerHTML = `
      <hr class="my-4">
      <div class="d-flex justify-content-between align-items-center">
         <h5 class="mb-0 ms-3">Importe Total:</h5>
        <span class="me-3"><strong><strong id="total-amount">$0.00</strong></span>
      </div>
      <hr class="my-5">
    `;

    // Agregar div de productos e importe total dentro del contenedor  del carrito
    cartContainer.appendChild(totalContainer);

    // Crear el contenedor para los botones
    let actionsContainer = document.createElement("div");
    actionsContainer.classList.add(

      "justify-content-between",
      "mt-4",
      "actions-container"
    );

    // Agregar botones al contenedor de acciones
    actionsContainer.innerHTML = `
    <div class="d-flex justify-content-between align-items-center me-3 mb-3" style="width: 100%;">
      <a href="javascript: history.go(-1)" class=" me-3 mb-3">← Seguir comprando</a>
      <button class="btn btn-black ms-3 mb-3" id="realizarCompra">Realizar la compra</button>
    </div>
    `;

    // Agregar el contenedor de acciones al contenedor principal del carrito
    cartContainer.appendChild(actionsContainer);

    let realizarCompra = document.getElementById("realizarCompra");

    realizarCompra.addEventListener("click", () => {
      // Agregamos para la validación de cantidades
      let quantityTrue = true;
      cart.forEach((product) => {
        if (product.quantity <= 0) {
          quantityTrue = false;
          alert("Debe seleccionar una cantidad válida");
        }

      });

      if (!quantityTrue) return; // Aseguramos que todos los productos tengan cantidad válida.


      actionsContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

          <div class=" me-3 mb-3">
          <fieldset>
        <legend>Tipo de envío:</legend>
        <label for="15"><input id="15" type="radio" name="tipo-envio"  checked value="15" />Premium 2 a 5 días (15%)</label><br>
        <label for="7"><input id="7" type="radio" name="tipo-envio" value="7"  /> Express 5 a 8 días (7%)</label><br>
        <label for="5"><input id="5" type="radio" name="tipo-envio" value="5" /> Standar 12 a 15 días (5%)</label>
      </fieldset>
          </div>
          
          <div class=" me-3 mb-3">
          <fieldset>
            <legend>Forma de pago:</legend>
            <input type="radio" name= "pago" value= "tarjeta" >Tarjeta de crédito</input><br>
            <input type="radio" name= "pago" value= "transferencia" >Transferencia bancaria</input><br>
            <input type="radio" name= "pago" value= "efectivo" >Pago en efectivo</input>
          </fieldset>
          </div>
            
      </div>
      <hr class="my-5">
      <button id="siguientePaso1" class="btn btn-black ms-3 mb-3">Siguiente paso</button>
      `;

      let radiobot = document.getElementsByName("tipo-envio");
      radiobot.forEach((radio) => {
        radio.addEventListener("change", () => {
          let envioElegido = document.querySelector(
            'input[name="tipo-envio"]:checked'
          ).value;
          localStorage.setItem("tipoEnvioElegido", envioElegido);

          updateTotals();
          updateFinalTotal();
        });
      });

      let envioElegidoInicial = document.querySelector(
        'input[name="tipo-envio"]:checked'
      ).value;
      localStorage.setItem("tipoEnvioElegido", envioElegidoInicial);

      let siguientePaso1 = document.getElementById("siguientePaso1");

      siguientePaso1.addEventListener("click", () => {
        // Agregamos para la validación de tipo de envío
        let shipmentInputs = document.getElementsByName("tipo-envio");
        let selectedInput = false;

        for (let input of shipmentInputs) {
          if (input.checked) {
            selectedInput = true;
          }
        }
        if (!selectedInput) {
          alert("Debes seleccionar un tipo de envío");
          return;
        }

        //Agregamos para validación de forma de pago

        let paymentsInputs = document.getElementsByName("pago");
        let selectedPayment = false;

        for (let i = 0; i < paymentsInputs.length; i++) {

          console.log(paymentsInputs[i].checked);
          if (paymentsInputs[i].checked) {
            selectedPayment = true;
          }
        }

        if (!selectedPayment) {
          alert("Debes seleccionar una forma de pago");
          return;
        };

        actionsContainer.innerHTML = `
        <form id="direccionForm">
        <div class="justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

            <div class=" me-3 mb-3">
              <h5 style="margin: 5px 0 20px 0; text-align: center;">Dirección de envio</h5>
              
              <label for="departamento" style="margin: 5px 0;">Departamento</label>
              <input type="text" id="departamento" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;" required></input><br>
              
              <label for="localidad" style="margin: 5px 0;">Localidad</label>
              <input type="text" id="localidad" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;" required></input><br>
              
              <label for="calle" style="margin: 5px 0;">Calle</label>
              <input type="text" id="calle" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;" required></input><br>

              <label for="numero" style="margin: 5px 0;">Número</label>
              <input type="number" id="numero" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;" required></input><br>

              <label for="esquina" style="margin: 5px 0;">Esquina</label>
              <input type="text" id="esquina" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;" required></input><br>
            </div>
              
        </div>
        <hr class="my-5">
        <button type="submit" id="siguientePaso2" class="btn btn-black ms-3 mb-3">Siguiente paso</button>
        </form>
        `;

        let form = document.getElementById('direccionForm');


        form.addEventListener('submit', (event) => {
          event.preventDefault();


          if (form.checkValidity()) {

            actionsContainer.innerHTML = `
            
        <div class="justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

            <div class=" me-3 mb-3" style="text-align: center;">
              <h5 style="margin: 5px 0 20px 0; text-align: center;">Costos</h5>
              
              <span style="margin: 10px 0;">Subtotal: </span>
             <span id="subtotal-amount" class="me-3" style="margin: 10px 0;"></span><br>


              <span style="margin: 10px 0;">Costo de envío: </span>
              <span id="shipping-cost" style="margin: 10px 0;"></span><br>

              <hr class="my-5">

              <strong style="margin: 30px 0; font-size: 120%;">Total: </strong>
              <strong id="final-total" style="margin: 30px 0; font-size: 120%;"></strong>
            </div>
                
        </div>

        <hr class="my-5">
        <button id="finalizarCompra" class="btn btn-black ms-3 mb-3">Finalizar compra</button>
        `;
        updateFinalTotal();

            let finishBuy = document.getElementById("finalizarCompra");
            finishBuy.addEventListener("click", function () {
              alert("Compra exitosa");

            });
          }
          
        });

      });

    });
    updateTotals();
    updateFinalTotal();

    // Event listeners para botones de cantidad
    document.querySelectorAll(".quantity-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = button.getAttribute("data-index");
        let action = button.getAttribute("data-action");
        let quantityInput = button.parentElement.querySelector(".quantity-input");

        if (action === "increase") {
          cart[index].quantity++;
        } else if (action === "decrease" && cart[index].quantity > 1) {
          cart[index].quantity--;
        }

        quantityInput.value = cart[index].quantity;

        let productSubtotal = button
          .closest(".card")
          .querySelector(".product-subtotal");
        productSubtotal.textContent = (
          cart[index].price * cart[index].quantity
        ).toFixed(2);
        updateTotals();

        if (document.getElementById("final-total")) {
          updateFinalTotal();
        }
      });
      
    });

    // event listeners para botones de eliminar
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        let index = button.getAttribute("data-index");
        cart.splice(index, 1);

        cartContainer.innerHTML = ""; //limpiar contenedor
        localStorage.setItem("cart", JSON.stringify(cart)); // guardar carrito actualizado
        location.reload(); // recargar para actualizar 
      });
    });


    // Borrar localStorage (Cerrar Sesión)
    document.getElementById("cerrar").addEventListener("click", function () {
      localStorage.removeItem("usuario");
      localStorage.removeItem("contraseña");
    });
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
    if (!ObjUsuario) { // Cambié aquí para verificar directamente el objeto
      location.href = "login.html";
    } else {
      // Asegúrate de usar una propiedad específica
      document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario.email; // Accede a la propiedad correcta
    }

  }

});
