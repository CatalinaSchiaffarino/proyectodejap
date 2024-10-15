document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location.href = "products.html";
    });

    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location.href = "products.html";
    });

    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location.href = "products.html";
    });

    // Validar que el localStorage esté dentro de nuestro navegador (saber si inició sesión)
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
    if (!ObjUsuario) { // Cambié aquí para verificar directamente el objeto
        location.href = "login.html";
    } else {
        // Asegúrate de usar una propiedad específica
        document.getElementById("user").innerHTML = ObjUsuario.email; // Accede a la propiedad correcta
    }

    // Borrar localStorage (Cerrar Sesión)
    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
    });
});
