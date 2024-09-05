document.addEventListener('DOMContentLoaded', ready);

function ready() {
    let cardIcon = document.querySelector('#card-icon');
    let cart = document.querySelector(".cart");
    let closedCart = document.querySelector('#closed-cart');

    cardIcon.onclick = () => {
        cart.classList.add("active");
        loadCart();
    }

    closedCart.onclick = () => {
        cart.classList.remove("active");
    }

    let addToCartButtons = document.getElementsByClassName("add-cart");
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buybutton);
    loadCart();
}

function buybutton() {
    window.location.href = 'orderPlaced.html';
    localStorage.removeItem('cart');
    document.getElementsByClassName("cart-content")[0].innerHTML = '';
    updateTotal();
}

function addCartClicked(event) {
    let button = event.target;
    let shopProducts = button.parentElement;
    let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    let price = shopProducts.getElementsByClassName("price")[0].innerText;
    let productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = cart.find(item => item.title === title);

    if (product) {
        alert("You already added this product to your cart");
        return;
    }

    cart.push({ title, price, productImg, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeCartItem(event) {
    let title = event.target.parentElement.getElementsByClassName("cart-product")[0].innerText;
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.title !== title);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function quantityChanges(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }

    let title = input.parentElement.getElementsByClassName("cart-product")[0].innerText;
    let cart = JSON.parse(localStorage.getItem('cart'));
    let product = cart.find(item => item.title === title);
    product.quantity = input.value;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotal();
}

function loadCart() {
    renderCart();
    updateTotal();
}

function renderCart() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = '';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(item => {
        let cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');
        cartShopBox.innerHTML = `
            <img src="${item.productImg}" alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product">${item.title}</div>
                <div class="cart-price">${item.price}</div>
                <input type="number" value="${item.quantity}" class="cart-quantity">
            </div>
            <i class='bx bxs-box cart-remove'></i>
        `;
        cartContent.append(cartShopBox);

        cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
        cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanges);
    });
}

function updateTotal(){
    let cartContent = document.getElementsByClassName("cart-content")[0]
    let cartBoxes = cartContent.getElementsByClassName("cart-box")
    let total = 0;
    for(let i=0; i<cartBoxes.length; i++){
         let cartBox = cartBoxes[i];
         let priceElement = cartBox.getElementsByClassName("cart-price")[0];
         let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
         let price =parseFloat(priceElement.innerHTML.replace("$", ""));
         let quantity = quantityElement.value;
         total = total + price * quantity;
         total= Math.round(total * 100)/100 ;

         document.getElementsByClassName("total-price")[0].innerHTML = "-Rs." + total};
}