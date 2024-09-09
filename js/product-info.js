document.addEventListener('DOMContentLoaded', () => {
    const productID = JSON.parse(localStorage.getItem('selectedProduct'));
    const currentCategory = document.getElementById("currentCategory");
    const productDetailContainer = document.getElementById('product-detail');
    const spinner = document.getElementById('spinner-wrapper');
    const ProductUrl = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    const myCarouselItemActive = document.getElementById('item active');
    const myCarouselItem1 = document.getElementById("item 1");
    const myCarouselItem2 = document.getElementById("item 2");
    const myCarouselItem3 = document.getElementById("item 3");

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
        const currencyFormatter = new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        });

        console.log(data.images);

        const imagesHtml = data.images.map(image => `
            <img src="${image}" alt="${data.name}">
        `).join('');

        let firstImage = data.images[0];
        let secondImage = data.images[1];
        let thirdImage = data.images[2];
        let fourthImage = data.images[3];

        productDetailContainer.innerHTML = `
        <h1>${data.name}</h1>
        <p class = "description">${data.description}</p>
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