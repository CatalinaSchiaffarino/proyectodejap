document.addEventListener("DOMContentLoaded", (event) => {
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", () => {
        let usuario = document.getElementById("usuario").value;
        let contraseña = document.getElementById("contraseña").value;
          //Guardo Sesion con localStorage
          localStorage.setItem("usuario",JSON.stringify(usuario));
          localStorage.setItem("contraseña",JSON.stringify(contraseña));
          let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
          let ObjContraseña = JSON.parse(localStorage.getItem("contraseña"));
          if (usuario!="" && contraseña!=""){
            window.location.href = "index.html";
        };

    });
});
