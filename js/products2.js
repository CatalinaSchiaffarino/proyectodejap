document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('spinner-wrapper');
    const container = document.getElementById('products-container');
    const categoryId = localStorage.getItem('categoryId') || '101';
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));

    if (localStorage.getItem("usuario") && localStorage.getItem("contraseña")) {
        document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario;
    }
    // borrar localStorage(Cerrar Sesión)
    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
    });

    let mayor$ = document.getElementById("mayor$");
    let menor$ = document.getElementById("menor$");
    let relevancia = document.getElementById("relevancia");

    let filtrarPrecio = document.getElementById("filtrarPrecio");
    let limpiarFiltro = document.getElementById("limpiarFiltro");

    let precioMin = undefined;
    let precioMax = undefined;

    let criterio = undefined;

    const url = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

    console.log('Category ID:', categoryId);

    function displayProducts(arrayProductos) {
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
            <a href="product-info.html" class="product" data-product='${JSON.stringify(product)}'>
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="price">${currencyFormatter.format(product.cost)}</p>
                        <p class="sold">Cantidad Vendidos: ${product.soldCount}</p>
                    </div>
                </div>
            </a>
            `;
        });

        contenedor.innerHTML = html;

        // Para guardar el ID del producto seleccionado y redireccionar a la info del producto.
        document.querySelectorAll('.product').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const product = JSON.parse(link.getAttribute('data-product'));
                localStorage.setItem('selectedProduct', JSON.stringify(product.id));
                window.location.href = 'product-info.html';
            });
        });
    }

    function ordProductos(criterio, array) {
        let result = [];
        if (criterio === "ORDmayor$") {
            result = array.sort((a, b) => {
                if (a.cost < b.cost) {
                    return 1;
                }
                if (a.cost > b.cost) {
                    return -1;
                }
                return 0;
            });
        } else if (criterio === "ORDmenor$") {
            result = array.sort((a, b) => {
                if (a.cost > b.cost) {
                    return 1;
                }
                if (a.cost < b.cost) {
                    return -1;
                }
                return 0;
            });
        } else if (criterio === "ORDrelevancia") {
            result = array.sort((a, b) => {
                let aVendidos = parseInt(a.soldCount);
                let bVendidos = parseInt(b.soldCount);

                if (aVendidos > bVendidos) {
                    return -1;
                }
                if (aVendidos < bVendidos) {
                    return 1;
                }
                return 0;
            });
        }
        return result;
    }

    function filtrarProductos(array, precioMax, precioMin) {
        return array.filter((producto) => producto.cost >= precioMin && producto.cost <= precioMax);
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data.products);

            let productos = data.products;

            filtrarPrecio.addEventListener("click", () => {
                precioMin = document.getElementById("precioMin").value || 0;
                precioMax = document.getElementById("precioMax").value || 99999999999;

                productos = filtrarProductos(productos, precioMax, precioMin);
                displayProducts(productos);
            });

            limpiarFiltro.addEventListener("click", () => {
                location.reload();
            });

            mayor$.addEventListener("click", () => {
                criterio = "ORDmayor$";
                productos = ordProductos(criterio, productos);
                displayProducts(productos);
                spinner.style.display = 'none';
            });

            menor$.addEventListener("click", () => {
                criterio = "ORDmenor$";
                productos = ordProductos(criterio, productos);
                displayProducts(productos);
                spinner.style.display = 'none';
            });

            relevancia.addEventListener("click", () => {
                criterio = "ORDrelevancia";
                productos = ordProductos(criterio, productos);
                displayProducts(productos);
                spinner.style.display = 'none';
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            contenedor.innerHTML = '<div class="alert alert-danger">Error al cargar los productos.</div>';
            spinner.style.display = 'none';
        });
});