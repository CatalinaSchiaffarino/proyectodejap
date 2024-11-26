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
            console.error("There has been a problem:", error);
            productDetailContainer.innerHTML =
                '<div class="alert alert-danger">Error al cargar el producto.</div>';
            spinner.style.display = "none";
        });

    // Mostrar las imágenes del carousel (optimizado con bucles)
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

    // Mostrar los detalles del producto
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
            <div class="button-container">
                <button class="btn btn-primary" id="btnAgregarCarrito">Agregar al carrito</button>
                <button class="btn btn-success" id="btnComprar">
                    <img src="img/carro.png" alt="Carro" style="width: 20px; height: 20px; margin-right: 5px; vertical-align: middle;">
                    Comprar
                </button>
            </div>
        `;
        document.getElementById("btnComprar").addEventListener("click", () => {
            addToCart(data);
            location.href = "cart.html";
        });
        document.getElementById("btnAgregarCarrito").addEventListener("click", () => {
            addToCart(data);
            alert("Producto agregado al carrito");
        });
    }

    // Cargar productos relacionados
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
            user: ObjUsuario.email,  // Usamos el email del usuario
            dateTime: formatDate(fecha),  // Formateamos la fecha de la forma que solicitaste
        };
        
        // Guardar comentarios en localStorage
        let storedComments = JSON.parse(localStorage.getItem("comments")) || [];
        storedComments.push(comentario);
        localStorage.setItem("comments", JSON.stringify(storedComments));
    }

    // Función de formato de fecha más legible
    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false  // Usamos formato de 24 horas
        };
        return date.toLocaleString('es-UY', options);  // Esto dará un formato como "15 oct. 2024, 18:30"
    }

    let savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    fetch(commentsUrl)
    .then((response) => response.json())
    .then((data) => {
        // Cargar comentarios desde localStorage
        let storedComments = JSON.parse(localStorage.getItem("comments")) || [];
        
        // Combinar y filtrar comentarios por producto
        const allComments = [...data, ...storedComments];
        const filteredComments = allComments.filter(comment => comment.product === productID);

        // Guardar solo los comentarios filtrados en localStorage
        localStorage.setItem("comments", JSON.stringify(allComments));

        // Mostrar comentarios para el producto actual
        showComments(filteredComments);

        spinner.style.display = "none";

        let calificacion;

        // Selección de estrellas optimizada
        const stars = [1, 2, 3, 4, 5];
        stars.forEach(i => {
            document.getElementById(`star${i}`).addEventListener("click", () => {
                calificacion = i;
                // Usamos un solo bucle para actualizar las clases de las estrellas
                stars.forEach(j => {
                    document.getElementById(`star${j}`).className = j <= calificacion ? "fas fa-star" : "far fa-star";
                });
            });
        });

        btnEnviar.addEventListener("click", () => {
            agregarComentario(calificacion);
        });
    })
    .catch((error) => {
        console.error("There has been a problem:", error);
        commentsContainer.innerHTML =
            '<div class="alert alert-danger">Error al cargar los comentarios.</div>';
        spinner.style.display = "none";
    });

// Función para agregar un nuevo comentario
function agregarComentario(calificacion) {
    if (!calificacion || !document.getElementById("comentario").value.trim()) {
        alert("Por favor, completa todos los campos y selecciona una calificación.");
        return;
    }

    let fecha = new Date();
    const nuevoComentario = {
        product: productID, // Asociar el comentario al producto actual
        score: calificacion,
        description: document.getElementById("comentario").value.trim(),
        user: ObjUsuario.email, // Usamos el email del usuario
        dateTime: formatDate(fecha), // Formateamos la fecha
    };

    // Guardar el comentario en localStorage
    let storedComments = JSON.parse(localStorage.getItem("comments")) || [];
    storedComments.push(nuevoComentario);
    localStorage.setItem("comments", JSON.stringify(storedComments));

    // Mostrar solo los comentarios para el producto actual
    const filteredComments = storedComments.filter(comment => comment.product === productID);
    showComments(filteredComments);

    // Limpiar el campo de texto y las estrellas
    document.getElementById("comentario").value = "";
    stars.forEach(j => {
        document.getElementById(`star${j}`).className = "far fa-star";
    });
}

// Función para mostrar los comentarios
function showComments(data) {
    commentsContainer.innerHTML = ""; // Limpiar el contenedor antes de añadir nuevos comentarios
    data.forEach((comment) => {
        // Formatear la fecha del comentario
        let formattedDate;
        if (comment.dateTime) {
            let parsedDate = new Date(comment.dateTime);
            formattedDate = formatDate(parsedDate);
        } else {
            formattedDate = "Fecha no disponible";
        }

        let commentContainer = document.createElement("div");
        commentContainer.className = "comment-container card mb-3 p-3";
        let starContainer = document.createElement("div");
        for (let i = 1; i <= 5; i++) {
            let star = document.createElement("i");
            star.className = i <= comment.score ? "fas fa-star" : "far fa-star";
            starContainer.appendChild(star);
        }
        commentContainer.innerHTML = `
            <div><strong>${comment.user}</strong> (${formattedDate})</div>
            <div>${starContainer.outerHTML}</div>
            <div>${comment.description}</div>
        `;
        commentsContainer.appendChild(commentContainer);
    });
}


    // Agregar un producto al carrito
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.cost,
                description: product.description,
                category: product.category,
                image: product.images[0],
                quantity: 1
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        let badge = document.getElementById("cant-cart");
        badge.innerHTML = `${cart.length}`;
    }

    // Mostrar la cantidad de productos en el carrito
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let badge = document.getElementById("cant-cart");
    badge.innerHTML = `${cart.length}`;
});
