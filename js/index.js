document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location.href = "products.html";
    });

    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location.href = "products.html";
    });
    
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location.href = "products.html";
    });
    //validar que el localStorage este dentro de nuestro navegador(Saber si inició sesión)
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
    if (!localStorage.getItem("usuario") && !localStorage.getItem("contraseña")) { //si no lo puedo hacer hago un location.href
        location.href = "login.html";
     }
    if (localStorage.getItem("usuario") && localStorage.getItem("contraseña")){
        document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario;
    }
    // borrar localStorage(Cerrar Sesión)
    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
     });

});