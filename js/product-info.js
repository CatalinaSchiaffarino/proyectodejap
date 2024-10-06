document.addEventListener('DOMContentLoaded', () => {
    let productID = JSON.parse(localStorage.getItem('selectedProduct'));
    let productDetailContainer = document.getElementById('product-detail');
    let relatedProductsContainer = document.getElementById('related-products');
    let spinner = document.getElementById('spinner-wrapper');
    let ProductUrl = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    let commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;
    let myCarouselItemActive = document.getElementById('item active');
    let myCarouselItem1 = document.getElementById("item 1");
    let myCarouselItem2 = document.getElementById("item 2");
    let myCarouselItem3 = document.getElementById("item 3");
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
    let commentsContainer = document.getElementById("comments");
    let btnEnviar = document.getElementById("btnEnviar");

    if (localStorage.getItem("usuario") && localStorage.getItem("contraseña")) {
        document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario;
    }

    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
    });

    fetch(ProductUrl)
        .then(response => response.json())
        .then(data => {
            showProduct(data);
            fetchRelatedProducts(data.relatedProducts);
            spinner.style.display = 'none';
        })
        .catch(error => {
            console.error('There has been a problema:', error);
            productDetailContainer.innerHTML = '<div class="alert alert-danger">Error al cargar el producto.</div>';
            spinner.style.display = 'none';
        });

    function showProduct(data) {
        if (!productID) {
            productDetailContainer.innerHTML = '<div class="alert alert-danger">No se encontraron detalles del producto.</div>';
            spinner.style.display = 'none';
            return;
        }

        let firstImage = data.images[0];
        let secondImage = data.images[1];
        let thirdImage = data.images[2];
        let fourthImage = data.images[3];

        productDetailContainer.innerHTML = `
            <h1>${data.name}</h1>
            <p class="description">${data.description}</p>
            <p class="price">${(data.cost).toLocaleString('es-UY', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        })}</p>
            <h1 class="category">Categoría: ${data.category}</h1>
            <p class="sold">Cantidad Vendidos: ${data.soldCount}</p>
        `;

        myCarouselItemActive.innerHTML = `<img src="${firstImage}" alt="${data.name}">`;
        myCarouselItem1.innerHTML = `<img src="${secondImage}" alt="${data.name}">`;
        myCarouselItem2.innerHTML = `<img src="${thirdImage}" alt="${data.name}">`;
        myCarouselItem3.innerHTML = `<img src="${fourthImage}" alt="${data.name}">`;
    }
    function fetchRelatedProducts(relatedProducts) {
        relatedProductsContainer.innerHTML = '';
        relatedProducts.forEach(product => {
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
        localStorage.setItem('selectedProduct', JSON.stringify(id));
        location.reload();
    };


    let comentario;
    function agregarComentario(calificacion){
        let fecha = new Date();
        comentario = {
            product: productID,
            score: calificacion,
            description: document.getElementById("comentario").value,
            user: ObjUsuario,
            dateTime: fecha.getFullYear() + "-" + ("0"+fecha.getMonth()).slice(-2) + "-" + ("0"+fecha.getDay()).slice(-2) + " " + ("0"+fecha.getHours()).slice(-2) + ":" + ("0"+fecha.getMinutes()).slice(-2) + ":" + ("0"+fecha.getSeconds()).slice(-2),
        }
    }


    fetch(commentsUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            showComments(data);
            spinner.style.display = 'none';

            let calificacion;

            document.getElementById("star1").addEventListener("click", () => {
                calificacion = 1;
                document.getElementById("star1").className = "fas fa-star";
                document.getElementById("star2").className = "far fa-star";
                document.getElementById("star3").className = "far fa-star";
                document.getElementById("star4").className = "far fa-star";
                document.getElementById("star5").className = "far fa-star";
                agregarComentario(calificacion);
            })

            document.getElementById("star2").addEventListener("click", () => {
                calificacion = 2;
                document.getElementById("star1").className = "fas fa-star";
                document.getElementById("star2").className = "fas fa-star";
                document.getElementById("star3").className = "far fa-star";
                document.getElementById("star4").className = "far fa-star";
                document.getElementById("star5").className = "far fa-star";
                agregarComentario(calificacion);
            })

            document.getElementById("star3").addEventListener("click", () => {
                calificacion = 3;
                document.getElementById("star1").className = "fas fa-star";
                document.getElementById("star2").className = "fas fa-star";
                document.getElementById("star3").className = "fas fa-star";
                document.getElementById("star4").className = "far fa-star";
                document.getElementById("star5").className = "far fa-star";
                agregarComentario(calificacion);
            })

            document.getElementById("star4").addEventListener("click", () => {
                calificacion = 4;
                document.getElementById("star1").className = "fas fa-star";
                document.getElementById("star2").className = "fas fa-star";
                document.getElementById("star3").className = "fas fa-star";
                document.getElementById("star4").className = "fas fa-star";
                document.getElementById("star5").className = "far fa-star";
                agregarComentario(calificacion);
            })

            document.getElementById("star5").addEventListener("click", () => {
                calificacion = 5;
                document.getElementById("star1").className = "fas fa-star";
                document.getElementById("star2").className = "fas fa-star";
                document.getElementById("star3").className = "fas fa-star";
                document.getElementById("star4").className = "fas fa-star";
                document.getElementById("star5").className = "fas fa-star";
                agregarComentario(calificacion);
            })

            btnEnviar.addEventListener("click", () => {
                agregarComentario(calificacion);
                showComments([comentario]);
                document.getElementById("comentario").value = "";
            });
        })
        .catch(error => {
            console.error('There has been a problem:', error);
            commentsContainer.innerHTML = '<div class="alert alert-danger">Error al cargar los comentarios.</div>';
            spinner.style.display = 'none';
        });

    function showComments(data) {

        if (!data.length) {
            commentsContainer.innerHTML = '<div>No se encontraron comentarios.</div>';
            spinner.style.display = 'none';
            return;
        }

        data.forEach(comment => {
            // Crear un nuevo contenedor para cada comentario
            let commentContainer = document.createElement("div");
            commentContainer.className = "comment-container card mb-3 p-3";

            // Crear las estrellas según la calificación
            let starContainer = document.createElement("div");
            starContainer.className = "star-rating-container";

            if (comment.score) {
                let score = comment.score;
                let stars = document.createElement("div");
                stars.className = "star-rating";

                for (let i = 1; i <= 5; i++) {
                    let star = document.createElement("i");
                    if (i <= score) {
                        star.className = "fas fa-star"; // Estrella llena
                    } else {
                        star.className = "far fa-star"; // Estrella vacía
                    }
                    stars.appendChild(star);
                }

                starContainer.appendChild(stars); // Añadir las estrellas al contenedor
            }

            // Crear el contenido del comentario
            let commentHtml = `
                    <p id ="user" class="card-title fw-bold"> ${comment.user}</p>
                    <p id ="dateTime" class="card-subtitle mb-2 text-muted"> ${comment.dateTime}</p>
                    <p id ="description" > ${comment.description}</p>
                `;

            // Añadir las estrellas y el contenido del comentario al contenedor
            commentContainer.innerHTML = commentHtml;
            commentContainer.appendChild(starContainer);

            // Añadir el contenedor del comentario completo al contenedor principal de comentarios
            commentsContainer.appendChild(commentContainer);
        });
    }

});
