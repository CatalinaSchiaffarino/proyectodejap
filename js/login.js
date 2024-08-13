document.addEventListener("DOMContentLoaded", (event)=>{
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", ()=>{
        let usuario = document.getElementById("usuario").value;
        let contraseña = document.getElementById("contraseña").value;
        if (usuario!="" && contraseña!=""){
            window.location.href = "index.html";
        };
    });
});