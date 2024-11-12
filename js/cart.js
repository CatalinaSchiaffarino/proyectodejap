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

    document.querySelector(
      ".total-container strong"
    ).textContent = `$${totalAmount.toFixed(2)}`;
    localStorage.setItem("cart", JSON.stringify(cart));
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
                  <a href="#" class="text-danger delete-btn" data-index="${index}"><i class="fa fa-trash icon-gray"></i></a>
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

  let badge =  document.getElementById("cant-cart");
  badge.innerHTML = `${cart.length}`;

    // Crear el contenedor de importe total dentro del contenedor de productos
    let totalContainer = document.createElement("div");
    totalContainer.classList.add("total-container");
    totalContainer.innerHTML = `
      <hr class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 ms-3">Importe Total:</h5>
        <span class="me-3"><strong>$${cart
          .reduce(
            (acc, product) =>
              acc +
              (parseFloat(product.price) || 0) *
                (parseInt(product.quantity) || 1),
            0
          )
          .toFixed(2)}</strong></span>
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
      actionsContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

          <div class=" me-3 mb-3">
            <h5>Tipo de envio:</h5>
            <input type="radio">Premium 2 a 5 dias (15%)</input><br>
            <input type="radio">Premium 5 a 8 dias (7%)</input><br>
            <input type="radio">Premium 12 a 15 dias (5%)</input>
          </div>
          
          <div class=" me-3 mb-3">
            <h5>Forma de pago:</h5>
            <input type="radio">Tarjeta de credito</input><br>
            <input type="radio">Transferencia bancaria</input><br>
            <input type="radio">Pago en efectivo</input>
          </div>
            
      </div>
      <hr class="my-5">
      <button id="siguientePaso1" class="btn btn-black ms-3 mb-3">Siguiente paso</button>
      `;

      let siguientePaso1 = document.getElementById("siguientePaso1");

      siguientePaso1.addEventListener("click", () => {
        actionsContainer.innerHTML = `
        <div class="justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

            <div class=" me-3 mb-3">
              <h5 style="margin: 5px 0 20px 0; text-align: center;">Direccion de envio</h5>
              
              <label for="departamento" style="margin: 5px 0;">Departamento</label>
              <input type="text" id="departamento" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;"></input><br>
              
              <label for="localidad" style="margin: 5px 0;">Localidad</label>
              <input type="text" id="localidad" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;"></input><br>
              
              <label for="calle" style="margin: 5px 0;">Calle</label>
              <input type="text" id="calle" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;"></input><br>

              <label for="numero" style="margin: 5px 0;">Numero</label>
              <input type="number" id="numero" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;"></input><br>

              <label for="esquina" style="margin: 5px 0;">Esquina</label>
              <input type="text" id="esquina" style="border: none; border-radius: 8px; background: rgb(180, 180, 180); margin: 5px 0;"></input><br>
            </div>
              
        </div>
        <hr class="my-5">
        <button id="siguientePaso2" class="btn btn-black ms-3 mb-3">Siguiente paso</button>
        `;

        let siguientePaso2 = document.getElementById("siguientePaso2");

      siguientePaso2.addEventListener("click", () => {
        actionsContainer.innerHTML = `
        <div class="justify-content-between align-items-center me-3 mb-3" style="width: 100%;">

            <div class=" me-3 mb-3" style="text-align: center;">
              <h5 style="margin: 5px 0 20px 0; text-align: center;">Costos</h5>
              
              <span style="margin: 10px 0;">Subtotal: </span>
              <span class="me-3" style="margin: 10px 0;">$${cart
                .reduce(
                  (acc, product) =>
                    acc +
                      (parseFloat(product.price) || 0) *
                        (parseInt(product.quantity) || 1),
                  0
                )
                .toFixed(2)}
              </span><br>

              <span style="margin: 10px 0;">Costo de envio: </span>
              <span style="margin: 10px 0;">*costo*</span><br>

              <hr class="my-5">

              <strong style="margin: 30px 0; font-size: 120%;">Total: </strong>
              <strong style="margin: 30px 0; font-size: 120%;">*total*</strong>
            </div>
                
        </div>

        <hr class="my-5">
        <button id="finalizarCompra" class="btn btn-black ms-3 mb-3">Finalizar compra</button>
        `;

        

      });

      });

    });


  }
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



});
