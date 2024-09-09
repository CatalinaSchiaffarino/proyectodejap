document.addEventListener('DOMContentLoaded', () => {
    let productID = JSON.parse(localStorage.getItem('selectedProduct'));
    let currentCategory = document.getElementById("currentCategory");
    let productDetailContainer = document.getElementById('product-detail');
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
    // borrar localStorage(Cerrar Sesión)
    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
    });
    

    fetch(ProductUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showProduct(data);
            spinner.style.display = 'none';
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            productDetailContainer.innerHTML = '<div class="alert alert-danger">Error al cargar el producto.</div>';
            spinner.style.display = 'none';
        });

    function showProduct(data) {

        if (!productID) {
            productDetailContainer.innerHTML = '<div class="alert alert-danger">No se encontraron detalles del producto.</div>';
            spinner.style.display = 'none';
            return;
        }

        // Crear y mostrar los detalles del producto
        let currencyFormatter = new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        });

        let firstImage = data.images[0];
        let secondImage = data.images[1];
        let thirdImage = data.images[2];
        let fourthImage = data.images[3];

        productDetailContainer.innerHTML = `
        <h1>${data.name}</h1>
        <p class = "description">${data.description}</p>
        <p class="price">${currencyFormatter.format(data.cost)}</p>
         <h1 class="category">Categoría: ${data.category}</h1>
        <p class="sold">Cantidad Vendidos: ${data.soldCount}</p>
    `;

        myCarouselItemActive.innerHTML = `
     <img src="${firstImage}" alt="${data.name}">
    `;

        myCarouselItem1.innerHTML = `
       <img src="${secondImage}" alt="${data.name}" >
             `;
        myCarouselItem2.innerHTML = `
             <img src="${thirdImage}" alt="${data.name}">
                   `;
        myCarouselItem3.innerHTML = `
                   <img src="${fourthImage}" alt="${data.name}">
                         `;

        spinner.style.display = 'none'; // Ocultar el spinner una vez cargado el producto
    }
});