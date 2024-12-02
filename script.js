document.addEventListener("DOMContentLoaded", () => {
    const registerScreen = document.getElementById("register-screen");
    const mainMenu = document.getElementById("main-menu");
    const emprenderScreen = document.getElementById("emprender-screen");
    const invertirScreen = document.getElementById("invertir-screen");
    const chatBox = document.getElementById("chat-box");
    const productListEmprendedor = document.getElementById("product-list-emprendedor");
    const productList = document.getElementById("product-list");
    const chatMessages = document.getElementById("chat-messages");
    const chatMessage = document.getElementById("chat-message");
    const logoutBtn = document.getElementById("logout-btn");

    const products = [];
    const users = [];
    let currentUser = null;
    let currentProductIndex = null;
    let currentChat = {};

    // Navegación y registro de usuario
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;

        currentUser = { username, email, role: "Emprendedor" }; // Por defecto, el primer usuario será emprendedor
        users.push(currentUser);

        registerScreen.classList.add("hidden");
        mainMenu.classList.remove("hidden");
    });

    document.getElementById("emprender-btn").addEventListener("click", () => {
        currentUser.role = "Emprendedor";
        showScreen(emprenderScreen);
    });

    document.getElementById("invertir-btn").addEventListener("click", () => {
        currentUser.role = "Inversor";
        showScreen(invertirScreen);
        renderProductsForInvestor();
    });

    document.getElementById("back-to-menu1").addEventListener("click", () => {
        showScreen(mainMenu);
    });

    document.getElementById("back-to-menu2").addEventListener("click", () => {
        showScreen(mainMenu);
    });

    document.getElementById("back-to-menu-from-chat").addEventListener("click", () => {
        showScreen(mainMenu);
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
        currentUser = null;
        showScreen(registerScreen);
    });

    // Subir producto (emprendedor)
    document.getElementById("emprender-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const productName = document.getElementById("product-name").value;
        const productPrice = document.getElementById("product-price").value;
        const productImage = document.getElementById("product-image").files[0];

        const product = { productName, productPrice, productImage };
        products.push(product);
        renderProductList();
        document.getElementById("product-name").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-image").value = "";
    });

    // Renderizar productos para el emprendedor
    function renderProductList() {
        productListEmprendedor.innerHTML = "";
        products.forEach((product, index) => {
            const div = document.createElement("div");
            const productImage = URL.createObjectURL(product.productImage);
            div.innerHTML = `
                <p>${product.productName} - $${product.productPrice}</p>
                <img src="${productImage}" alt="${product.productName}">
                <button onclick="startChat(${index})">Ver Chat</button>
            `;
            productListEmprendedor.appendChild(div);
        });
    }

    // Renderizar productos para el inversor
    function renderProductsForInvestor() {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            const div = document.createElement("div");
            const productImage = URL.createObjectURL(product.productImage);
            div.innerHTML = `
                <p>${product.productName} - $${product.productPrice}</p>
                <img src="${productImage}" alt="${product.productName}">
                <button onclick="startChat(${index})">Contactar</button>
            `;
            productList.appendChild(div);
        });
    }

    // Iniciar chat entre inversor y emprendedor
    window.startChat = (productIndex) => {
        currentProductIndex = productIndex;
        if (!currentChat[productIndex]) {
            currentChat[productIndex] = { messages: [] };
        }
        chatMessages.innerHTML = renderMessages(currentChat[productIndex].messages);
        showScreen(chatBox);
    };

    // Función para renderizar mensajes en el chat
    function renderMessages(messages) {
        return messages.map(message => `
            <div class="message">
                <p><strong>${message.sender}:</strong> ${message.message}</p>
            </div>
        `).join('');
    }

    // Enviar mensaje en el chat
    document.getElementById("send-message").addEventListener("click", () => {
        if (!currentChat[currentProductIndex]) return;
        const message = chatMessage.value;
        if (message.trim() === "") return;

        const sender = currentUser.username;
        currentChat[currentProductIndex].messages.push({ sender, message });

        chatMessages.innerHTML = renderMessages(currentChat[currentProductIndex].messages);
        chatMessage.value = "";
    });

    // Función para mostrar la pantalla correcta y ocultar las demás
    function showScreen(screen) {
        // Ocultar todas las pantallas
        const screens = [registerScreen, mainMenu, emprenderScreen, invertirScreen, chatBox];
        screens.forEach((scr) => scr.classList.add("hidden"));
        // Mostrar la pantalla seleccionada
        screen.classList.remove("hidden");
    }
});
