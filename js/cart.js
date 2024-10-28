document.addEventListener("DOMContentLoaded", function () {
  let cartContainer = document.getElementById("cart-body"); // Contenerdor del carrito
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
  } else {
    let totalAmount = 0; // Variable para calcular el importe total

    //Acción para cada uno de los productos en el carrito
    cart.forEach(product => {
      totalAmount += product.price; // Sumar el precio de cada producto al total

      let productCard = document.createElement("div");
      productCard.classList.add("card", "mb-4");
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
                  <button class="quantity-btn" data-action="decrease">-</button>
                  <input type="text" class="quantity-input" value="1" readonly>
                  <button class="quantity-btn" data-action="increase">+</button>
                </div>
                <div class="d-flex align-items-center">
                  <span class="me-3"><span>$${product.price}</span></span>
                  <a href="#" class="text-danger"><i class="fa fa-trash icon-gray"></i></a>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <p class="card-text text-muted mb-0 me-5 mt-3" style="flex: 1;">${product.description}</p>
                <p class="text-center mt-4" style="min-width: 120px;"><span>Subtotal:</span> <br> $${product.price}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      cartContainer.appendChild(productCard);
    });

    // Crear el contenedor de importe total dentro del contenedor de productos
    let totalContainer = document.createElement("div");
    totalContainer.classList.add("total-container");
    totalContainer.innerHTML = `
      <hr class="my-4">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 ms-3">Importe Total:</h5>
        <span class="me-3"><strong>$${totalAmount.toFixed(2)}</strong></span>
      </div>
      <hr class="my-5">
    `;

    // Agregar div de productos e importe total dentro del contenedor  del carrito
    cartContainer.appendChild(totalContainer);

    // Crear el contenedor para los botones
    let actionsContainer = document.createElement("div");
    actionsContainer.classList.add("d-flex", "justify-content-between", "mt-4", "actions-container");

    // Agregar botones al contenedor de acciones
    actionsContainer.innerHTML = `
      <a href="#" class=" me-3 mb-3">← Seguir comprando</a>
      <button class="btn btn-black ms-3 mb-3">Realizar la compra</button>
    `;

    // Agregar el contenedor de acciones al contenedor principal del carrito
    cartContainer.appendChild(actionsContainer);
  }
});
