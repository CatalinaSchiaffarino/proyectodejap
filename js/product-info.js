document.addEventListener('DOMContentLoaded', () => {
    let productID = JSON.parse(localStorage.getItem('selectedProduct'));
    let productDetailContainer = document.getElementById('product-detail');
    let relatedProductsContainer = document.getElementById('related-products');
    let spinner = document.getElementById('spinner-wrapper');
    let ProductUrl = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    let myCarouselItemActive = document.getElementById('item active');
    let myCarouselItem1 = document.getElementById("item 1");
    let myCarouselItem2 = document.getElementById("item 2");
    let myCarouselItem3 = document.getElementById("item 3");
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));

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

    window.loadProduct = function(id) {
        localStorage.setItem('selectedProduct', JSON.stringify(id));
        location.reload(); 
    };
});
