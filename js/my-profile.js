document.addEventListener("DOMContentLoaded", () => {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        location.href = "login.html";
    } else {
        document.getElementById("displayUsername").innerText = "Cliente: " + usuario.email;
        loadUserProfile(usuario.email);
    }

    function loadUserProfile(email) {
        const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        document.getElementById("email").value = email;
        document.getElementById("nombre").value = userProfile.nombre || '';
        document.getElementById("segundoNombre").value = userProfile.segundoNombre || '';
        document.getElementById("apellido").value = userProfile.apellido || '';
        document.getElementById("segundoApellido").value = userProfile.segundoApellido || '';
        document.getElementById("telefono").value = userProfile.telefono || '';
        if (userProfile.fotoPerfil) {
            document.getElementById("profilePicture").src = userProfile.fotoPerfil;
        }
    }

    const fileInput = document.getElementById("fotoPerfil");
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("profilePicture").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const form = document.getElementById("profileForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        if (!nombre || !apellido) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }
        let fotoPerfil = document.getElementById("profilePicture").src;
        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fotoPerfil = e.target.result;
                saveUserProfile(fotoPerfil);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            saveUserProfile(fotoPerfil);
        }
    });

    function saveUserProfile(fotoPerfil) {
        const userProfile = {
            nombre: document.getElementById("nombre").value.trim(),
            segundoNombre: document.getElementById("segundoNombre").value,
            apellido: document.getElementById("apellido").value.trim(),
            segundoApellido: document.getElementById("segundoApellido").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            fotoPerfil: fotoPerfil
        };
        console.log("Guardando usuario en localStorage:", userProfile);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        alert("Datos guardados correctamente!");
    }
    let switchBtn = document.getElementById("switch__btn");
    
    /* Establecemos el theme */
    let setTheme = (theme) => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }

    /* Cambiar entre los temas */
    let toggleTheme = () => {
        let currentTheme = localStorage.getItem("theme");
        let switchTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(switchTheme);
    }

    /* Aplicamos el theme guardado al cargar la página */
    let savedTheme = localStorage.getItem("theme") || "light"; // Por defecto "light" si no hay tema guardado
    setTheme(savedTheme);

    /* Al hacer click en el botón, cambia el tema */
    switchBtn.addEventListener("click", toggleTheme);


    document.getElementById("cerrar").addEventListener("click", function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
        localStorage.removeItem("userProfile");
        location.href = "login.html";
    });
});
