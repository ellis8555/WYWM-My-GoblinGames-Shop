// display items in cart on the checkout page
if (localStorage.getItem("items")) {
  // get array of items in shopping cart
  const itemsInCart = JSON.parse(localStorage.getItem("items"));
  // for each item process that items data to be displayed
  itemsInCart.forEach((item) => {
    // div that contains this item
    const productsDiv = document.createElement("div");
    productsDiv.id = `${item.Product_ID}`;
    productsDiv.classList = "d-flex align-items-center mb-3";
    // flex div that contains product image
    const imgDiv = document.createElement("div");
    imgDiv.classList = "shadow ms-3";
    // create the image
    const img = document.createElement("img");
    // load image from localstorage
    img.src = item.imgPath || item.background_image;
    img.alt = `${item.Name || item.name} Goblin`;
    img.classList = "img-thumbnail";
    img.style.objectFit = "contain";
    // append the image to containing div
    imgDiv.append(img);
    productsDiv.append(imgDiv);
    // flex div that contains product name and quantity ordered
    const productsOrdered = document.createElement("div");
    productsOrdered.classList = "ms-5";
    productsOrdered.innerHTML = `<strong>${
      item.Name || item.name
    }</strong> - $${item.Price}.00 x <span id="checkoutItemQuantity">${
      item.quantity
    }</span>`;
    // append products details to containing div
    productsDiv.append(productsOrdered);
    // flex div that contains total price for this item
    const itemsTotalDiv = document.createElement("div");
    itemsTotalDiv.classList = "ms-auto";
    itemsTotalDiv.id = `${item.Name || item.name}TotalPrice`;
    itemsTotalDiv.innerHTML = `+ $${+item.Price * item.quantity}.00`;
    productsDiv.append(itemsTotalDiv);
    // append item to the page
    $("#checkoutItemList").append(productsDiv);
  });
  // get the total price from localstorage
  $("#shoppingCartTotal").text(
    `Total: $${localStorage.getItem("cartTotalPrice")}.00`
  );
} else {
  $("#checkoutItemList").text("Cart is empty.");
  $("#submitCheckout").remove();
}
