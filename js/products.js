document.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('spinner-wrapper');
    const productList = document.getElementById('products-container');
    const categoryId = localStorage.getItem('categoryId') || '101'; 
    
    console.log('Category ID:', categoryId); 
    const url = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data.products);
            spinner.style.display = 'none';
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            productList.innerHTML = '<div class="alert alert-danger">Error al cargar los productos.</div>';
            spinner.style.display = 'none';
        });

    function displayProducts(products) {
        if (products.length === 0) {
            productList.innerHTML = '<div class="alert alert-warning">No hay productos disponibles.</div>';
            return;
        }

        const currencyFormatter = new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol'
        });

        let html = '';
        products.forEach(product => {
            html += `
                <a href="product-info.html" class="product" data-product='${JSON.stringify(product)}'>
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="price">${currencyFormatter.format(product.cost)}</p>
                        <p class="sold">Cantidad Vendidos: ${product.soldCount}</p>
                    </div>
                </a>
            `;
        });

        productList.innerHTML = html;

        // Add event listener to the "product" links
        document.querySelectorAll('.product').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const product = JSON.parse(link.getAttribute('data-product'));
                localStorage.setItem('selectedProduct', JSON.stringify(product.id));
                window.location.href = 'product-info.html';
            });
        });
    }
});