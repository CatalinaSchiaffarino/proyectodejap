document.addEventListener("DOMContentLoaded", () => {
  let productID = JSON.parse(localStorage.getItem("selectedProduct"));
  let productDetailContainer = document.getElementById("product-detail");
  let relatedProductsContainer = document.getElementById("related-products");
  let spinner = document.getElementById("spinner-wrapper");
  let ProductUrl = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  let commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;
  let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
  let commentsContainer = document.getElementById("comments");
  let btnEnviar = document.getElementById("btnEnviar");

  if (!ObjUsuario) {
      location.href = "login.html";
  } else {
      document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario.email;
  }

  document.getElementById("cerrar").addEventListener("click", function () {
      localStorage.removeItem("usuario");
      localStorage.removeItem("contraseña");
  });

  fetch(ProductUrl)
      .then((response) => response.json())
      .then((data) => {
          displayCarouselImages(data.images);
          showProduct(data);
          fetchRelatedProducts(data.relatedProducts);
          spinner.style.display = "none";
      })
      .catch((error) => {
          console.error("There has been a problema:", error);
          productDetailContainer.innerHTML =
              '<div class="alert alert-danger">Error al cargar el producto.</div>';
          spinner.style.display = "none";
      });

  function displayCarouselImages(images) {
      const carouselInner = document.getElementById('carouselInner');
      const carouselIndicators = document.getElementById('carouselIndicators');

      carouselInner.innerHTML = '';
      carouselIndicators.innerHTML = '';

      images.forEach((imgSrc, index) => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');

          if (index === 0) {
              carouselItem.classList.add('active');
          }

          const img = document.createElement('img');
          img.src = imgSrc;
          img.classList.add('d-block', 'w-100');
          img.alt = `Imagen ${index + 1}`;

          carouselItem.appendChild(img);
          carouselInner.appendChild(carouselItem);

          const indicator = document.createElement('li');
          indicator.setAttribute('data-bs-target', '#myCarousel');
          indicator.setAttribute('data-bs-slide-to', index);
          if (index === 0) {
              indicator.classList.add('active');
          }
          carouselIndicators.appendChild(indicator);
      });
  }

  function showProduct(data) {
      if (!productID) {
          productDetailContainer.innerHTML =
              '<div class="alert alert-danger">No se encontraron detalles del producto.</div>';
          spinner.style.display = "none";
          return;
      }

      productDetailContainer.innerHTML = `
          <h2 id="info-titulo">${data.name}</h2>
          <p class="description">${data.description}</p>
          <p class="price">${data.cost.toLocaleString("es-UY", {
              style: "currency",
              currency: "USD",
              currencyDisplay: "symbol",
          })}</p>
          <h2 class="category">Categoría: ${data.category}</h2>
          <p class="sold">Cantidad Vendidos: ${data.soldCount}</p>
          <button class="btn btn-success" id="btnComprar">Comprar</button> <!-- Botón de Comprar -->
      `;

      // Agregar evento al botón de comprar
      document.getElementById("btnComprar").addEventListener("click", () => {
          addToCart(data); // Llama a la función addToCart con los detalles del producto
      });
  }

  function fetchRelatedProducts(relatedProducts) {
      relatedProductsContainer.innerHTML = "";
      relatedProducts.forEach((product) => {
          let relatedProductHTML = `
              <div class="col-md-3">
                  <div class="card">
                      <img src="${product.image}" class="card-img-top" alt="${product.name}">
                      <div class="card-body">
                          <h5 class="card-title">${product.name}</h5>
                          <button class="btn btn-primary" onclick="loadProduct(${product.id})">Ver producto</button>
                      </div>
                  </div>
              </div>
          `;
          relatedProductsContainer.innerHTML += relatedProductHTML;
      });
  }

  window.loadProduct = function (id) {
      localStorage.setItem("selectedProduct", JSON.stringify(id));
      location.reload();
  };

  let comentario;
  function agregarComentario(calificacion) {
      let fecha = new Date();
      comentario = {
          product: productID,
          score: calificacion,
          description: document.getElementById("comentario").value,
          user: ObjUsuario,
          dateTime:
              fecha.getFullYear() +
              "-" +
              ("0" + fecha.getMonth()).slice(-2) +
              "-" +
              ("0" + fecha.getDay()).slice(-2) +
              " " +
              ("0" + fecha.getHours()).slice(-2) +
              ":" +
              ("0" + fecha.getMinutes()).slice(-2) +
              ":" +
              ("0" + fecha.getSeconds()).slice(-2),
      };
  }

  let savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  console.log("Theme aplicado en esta página:", savedTheme);

  fetch(commentsUrl)
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          showComments(data);
          spinner.style.display = "none";

          let calificacion;

          document.getElementById("star1").addEventListener("click", () => {
              calificacion = 1;
              document.getElementById("star1").className = "fas fa-star";
              document.getElementById("star2").className = "far fa-star";
              document.getElementById("star3").className = "far fa-star";
              document.getElementById("star4").className = "far fa-star";
              document.getElementById("star5").className = "far fa-star";
          });

          document.getElementById("star2").addEventListener("click", () => {
              calificacion = 2;
              document.getElementById("star1").className = "fas fa-star";
              document.getElementById("star2").className = "fas fa-star";
              document.getElementById("star3").className = "far fa-star";
              document.getElementById("star4").className = "far fa-star";
              document.getElementById("star5").className = "far fa-star";
          });

          document.getElementById("star3").addEventListener("click", () => {
              calificacion = 3;
              document.getElementById("star1").className = "fas fa-star";
              document.getElementById("star2").className = "fas fa-star";
              document.getElementById("star3").className = "fas fa-star";
              document.getElementById("star4").className = "far fa-star";
              document.getElementById("star5").className = "far fa-star";
          });

          document.getElementById("star4").addEventListener("click", () => {
              calificacion = 4;
              document.getElementById("star1").className = "fas fa-star";
              document.getElementById("star2").className = "fas fa-star";
              document.getElementById("star3").className = "fas fa-star";
              document.getElementById("star4").className = "fas fa-star";
              document.getElementById("star5").className = "far fa-star";
          });

          document.getElementById("star5").addEventListener("click", () => {
              calificacion = 5;
              document.getElementById("star1").className = "fas fa-star";
              document.getElementById("star2").className = "fas fa-star";
              document.getElementById("star3").className = "fas fa-star";
              document.getElementById("star4").className = "fas fa-star";
              document.getElementById("star5").className = "fas fa-star";
          });

          btnEnviar.addEventListener("click", () => {
              agregarComentario(calificacion);
              showComments([comentario]);
              document.getElementById("comentario").value = "";
          });
      })
      .catch((error) => {
          console.error("There has been a problem:", error);
          commentsContainer.innerHTML =
              '<div class="alert alert-danger">Error al cargar los comentarios.</div>';
          spinner.style.display = "none";
      });

  function showComments(data) {
      if (!data.length) {
          commentsContainer.innerHTML = "<div>No se encontraron comentarios.</div>";
          spinner.style.display = "none";
          return;
      }

      data.forEach((comment) => {
          let commentContainer = document.createElement("div");
          commentContainer.className = "comment-container card mb-3 p-3";

          let starContainer = document.createElement("div");
          for (let i = 1; i <= 5; i++) {
              let star = document.createElement("i");
              star.className = i <= comment.score ? "fas fa-star" : "far fa-star";
              starContainer.appendChild(star);
          }

          commentContainer.innerHTML = `
              <div><strong>${comment.user}</strong> (${comment.dateTime})</div>
              <div>${starContainer.outerHTML}</div>
              <div>${comment.description}</div>
          `;
          commentsContainer.appendChild(commentContainer);
      });
  }

  function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.push({
          id: product.id,
          name: product.name,
          price: product.cost,
          description: product.description,
          category: product.category,
          image: product.images[0]
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      location.href = "cart.html"; // Redirigir al carrito
  }
});
