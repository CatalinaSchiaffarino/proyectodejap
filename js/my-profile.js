document.addEventListener("DOMContentLoaded", () => {
    // Verificar usuario
    let ObjUsuario = JSON.parse(localStorage.getItem("usuario"));
    if (!ObjUsuario) {
        location.href = "login.html";
    } else {
        document.getElementById("user").innerHTML = "Cliente: " + ObjUsuario.email;
        loadUserProfile(ObjUsuario.email);
    }

    // Cargar perfil del usuario
    function loadUserProfile(email) {
        const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        document.getElementById("email").value = userProfile.email || email; // Prioriza el correo guardado en el perfil
        document.getElementById("nombre").value = userProfile.nombre || '';
        document.getElementById("segundoNombre").value = userProfile.segundoNombre || '';
        document.getElementById("apellido").value = userProfile.apellido || '';
        document.getElementById("segundoApellido").value = userProfile.segundoApellido || '';
        document.getElementById("telefono").value = userProfile.telefono || '';
        const fotoPerfil = userProfile.fotoPerfil || "img/fotoperfil.png";
        document.getElementById("profilePicture").src = fotoPerfil;
    }

    // Manejar la selección de imagen con recorte
    const fileInput = document.getElementById("fotoPerfil");
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Por favor selecciona un archivo de imagen.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // Límite de 2 MB
                alert("La imagen debe tener un tamaño menor a 2 MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                showCropModal(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    

    function showCropModal(imageSrc) {
        const modal = document.createElement("div");
        modal.id = "cropModal";
        modal.innerHTML = `
            <div class="crop-modal-overlay">
                <div class="crop-modal-content">
                    <img id="cropImage" src="${imageSrc}" alt="Recortar imagen">
                    <div class="crop-modal-actions">
                        <button id="cropConfirm" class="btn btn-success">Confirmar</button>
                        <button id="cropCancel" class="btn btn-danger">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    
        const cropImage = document.getElementById("cropImage");
        const cropper = new Cropper(cropImage, {
            aspectRatio: 1, // Mantiene un cuadrado perfecto
            viewMode: 2, // Ajusta la imagen al contenedor pero limita el zoom para evitar recortar fuera del lienzo
            autoCropArea: 0.5, // Reduce el tamaño del área de recorte inicial al 50% del contenedor
            minCropBoxWidth: 100, // Tamaño mínimo del área de recorte
            minCropBoxHeight: 100,
            background: false, // Oculta la cuadrícula detrás
            zoomOnWheel: true, // Permite zoom con la rueda del mouse
            scalable: true, // Permite escalar
        });
    
        document.getElementById("cropConfirm").addEventListener("click", () => {
            const canvas = cropper.getCroppedCanvas();
            const croppedImage = canvas.toDataURL("image/png");
            document.getElementById("profilePicture").src = croppedImage;
            saveProfilePicture(croppedImage);
            document.body.removeChild(modal);
        });
    
        document.getElementById("cropCancel").addEventListener("click", () => {
            document.body.removeChild(modal);
        });
    }
    

    // Guardar la imagen de perfil en localStorage
    function saveProfilePicture(croppedImage) {
        const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        userProfile.fotoPerfil = croppedImage;
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }
    document.getElementById("removeProfilePicture").addEventListener("click", () => {
        // Imagen predeterminada
        const defaultImage = "img/fotoperfil.png";
        document.getElementById("profilePicture").src = defaultImage;
    
        // Actualizar localStorage
        const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        userProfile.fotoPerfil = defaultImage;
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
    
        // Confirmación
        alert("La imagen de perfil ha sido eliminada y se ha restaurado la predeterminada.");
    });
    
    // Guardar perfil del usuario
    const form = document.getElementById("profileForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!nombre || !apellido || !email) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const fotoPerfil = document.getElementById("profilePicture").src;
        saveUserProfile(email, fotoPerfil);
    });

    function saveUserProfile(email, fotoPerfil) {
        const userProfile = {
            nombre: document.getElementById("nombre").value.trim(),
            segundoNombre: document.getElementById("segundoNombre").value,
            apellido: document.getElementById("apellido").value.trim(),
            segundoApellido: document.getElementById("segundoApellido").value,
            email: email,
            telefono: document.getElementById("telefono").value,
            fotoPerfil: fotoPerfil
        };

        // Guardar en localStorage
        localStorage.setItem("userProfile", JSON.stringify(userProfile));

        // Actualizar el usuario principal en localStorage
        localStorage.setItem("usuario", JSON.stringify({ email }));

        // Actualizar el menú con el nuevo correo
        document.getElementById("user").innerHTML = "Cliente: " + email;

        // Mostrar mensaje de confirmación
        const confirmationMsg = document.getElementById("confirmationMsg");
        confirmationMsg.textContent = "Datos guardados correctamente.";
        confirmationMsg.style.display = "block";

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            confirmationMsg.style.display = "none";
        }, 3000);
    }

    // Modo oscuro/claro
    const switchBtn = document.getElementById("switch__btn");

    const setTheme = (theme) => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem("theme");
        const switchTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(switchTheme);
    };

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    switchBtn.addEventListener("click", toggleTheme);

    // Cerrar sesión
    document.getElementById("cerrar").addEventListener("click", () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("contraseña");
        localStorage.removeItem("userProfile");
        location.href = "login.html";
    });

    // Carrito
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById("cant-cart");
    badge.innerHTML = `${cart.length}`;
});
