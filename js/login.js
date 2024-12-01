document.addEventListener("DOMContentLoaded", (event) => {
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", () => {
        let usuario = document.getElementById("usuario").value; // Correo electrónico
        let contraseña = document.getElementById("contraseña").value;

        // Validar que los campos no estén vacíos
        if (usuario !== "" && contraseña !== "") {
            // Guardar la sesión con localStorage
            const ObjUsuario = {
                email: usuario,
                // Puedes agregar más datos aquí si es necesario
            };

            localStorage.setItem("usuario", JSON.stringify(ObjUsuario));
            localStorage.setItem("contraseña", JSON.stringify(contraseña));

            // Redirigir a la página de perfil o a la página principal
            window.location.href = "index.html"; // O "index.html" según tu flujo
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });
});
