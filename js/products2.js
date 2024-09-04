const spinner = document.getElementById('spinner-wrapper');
const contenedor = document.getElementById('products-container');
const categoryId = localStorage.getItem('categoryId') || '101';

let mayor$ = document.getElementById("mayor$");
let menor$ = document.getElementById("menor$");
let relevancia = document.getElementById("relevancia");

let criterio = undefined;

const url = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

document.addEventListener('DOMContentLoaded', () => {

    console.log('Category ID:', categoryId);

    function displayProducts(arrayProductos){
        if (arrayProductos.length === 0) {
            contenedor.innerHTML = '<div class="alert alert-warning">No hay productos disponibles.</div>';
            return;
        }

        const currencyFormatter = new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        });

        let html = '';
        arrayProductos.forEach(product => {
            html += `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="price">${currencyFormatter.format(product.cost)}</p>
                        <p class="sold">Cantidad Vendidos: ${product.soldCount}</p>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;
    };

    function ordProductos(criterio, array){
        let result = [];
        if (criterio === "ORDmayor$") {
            result = array.sort((a, b) => {
                if (a.cost < b.cost){
                    return 1;
                };
                if (a.cost > b.cost){
                    return -1;
                };
                return 0;
            });
        }else if (criterio === "ORDmenor$"){
            result = array.sort((a, b) => {
                if (a.cost > b.cost){
                    return 1;
                }
                if (a.cost < b.cost){
                    return -1;
                }
                return 0;
            });
        }else if (criterio === "ORDrelevancia"){
            result = array.sort((a, b) => {
                let aVendidos = parseInt(a.soldCount);
                let bVendidos = parseInt(b.soldCount);
    
                if (aVendidos > bVendidos){
                    return -1;
                }
                if (aVendidos < bVendidos){
                    return 1;
                }
                return 0;
            });
        }
        return result;
    };

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data.products);

            mayor$.addEventListener("click", () => {
                criterio = "ORDmayor$";
                let productos = ordProductos(criterio, data.products);
                displayProducts(productos);
                spinner.style.display = 'none';
            });

            menor$.addEventListener("click", () => {
                criterio = "ORDmenor$";
                let productos = ordProductos(criterio, data.products);
                displayProducts(productos);
                spinner.style.display = 'none';
            });

            relevancia.addEventListener("click", () => {
                criterio = "ORDrelevancia";
                let productos = ordProductos(criterio, data.products);
                displayProducts(productos);
                spinner.style.display = 'none';
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            productList.innerHTML = '<div class="alert alert-danger">Error al cargar los productos.</div>';
            spinner.style.display = 'none';
        });


});