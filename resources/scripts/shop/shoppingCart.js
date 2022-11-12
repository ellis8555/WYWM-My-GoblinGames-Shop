$(document).ready(function () {
  let products = [];

  let cartQuantity;

  // set the shopping cart icon total items indicator
  if (localStorage.getItem("items")) {
    cartQuantity = countCartItems();
    $(".numberOfItems").text(cartQuantity);
    $("#proceedToCheckout").attr("disabled", false);
  } else {
    cartQuantity = 0;
    $(".numberOfItems").text(cartQuantity);
    $("#proceedToCheckout").attr("disabled", true);
  }

  // if on checkout page disable proceed to checkout
  const path = window.location.pathname;
  if (path.includes("checkout")) {
    $("#proceedToCheckout").attr("disabled", true);
  }

  // when the user clicks the shopping cart button, update .modal-body with the items in the cart
  $(".buttonWrapper").click(function () {
    if (localStorage.getItem("items")) {
      products = JSON.parse(localStorage.getItem("items"));
      let modalBody = $(".modal-body");
      modalBody.empty(); // empty the initial contents of modal body before adding new items

      // render products name, price, and quantity
      products.map((product) => {
        modalBody.append(
          `<div class="productWrapper d-flex mb-2" id="${product.Product_ID}">
              <div id="productInfo" class="me-auto">
                <div class="name">${product.Name || product.name} - $${
            product.Price || product.price
          }/item</div>
                <div class="quantity">x ${product.quantity}</div>         
              </div>    
                <div class="me-2">
                  <img src="${
                    product.imgPath || product.background_image
                  }"  class="img-thumbnail"/>
                </div>
              <div id="actions">
                <button class="btn btn-primary increaseQuantity" id="${
                  product.Product_ID
                }">
                  +
                </button>
                <button class="btn btn-danger decreaseQuantity" id="${
                  product.Product_ID
                }">
                  -
                </button>  
                </div>            
            </div>
            `
        );
      });

      // display the grand total at bottom of modal
      displayGrandTotal();

      // increase quantity inside of shopping cart modal
      $(".increaseQuantity").click(function () {
        // get the id attribute of the button
        let productID = $(this).attr("id");
        // match the productID to the selected item inside products array
        let product = products.find(
          (product) => product.Product_ID == productID
        );
        // then increase the selected item quantity by 1
        product.quantity++;

        // update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
        $(this)
          .closest(".productWrapper") // get the closest productWrapper div
          .find(".quantity") // get the quantity div
          .text(`x ${product.quantity}`); // update the text of the quantity

        // update the items in localStorage
        localStorage.setItem("items", JSON.stringify(products));
        // update cart total price
        grandTotal(+product.Price, true);
        // update shopping cart item quantity indicator
        const cartQuantity = countCartItems();
        $(".numberOfItems").text(cartQuantity);
        // get path to look if on checkout page for next if statement
        const path = window.location.pathname;
        if (path.includes("checkout")) {
          $("#shoppingCartTotal").text(
            `Total: $${localStorage.getItem("cartTotalPrice")}.00`
          );
          $(`#checkoutItemQuantity`).text(`${product.quantity}`);
          $(`#${product.Name}TotalPrice`).text(
            `+ $${+product.Price * product.quantity}.00`
          );
        }
      });

      // decrease quantity inside shopping cart modal
      $(".decreaseQuantity").click(function () {
        // get which page on to determine further actions
        const path = window.location.pathname;
        // get the id attribute of the button
        let productID = $(this).attr("id");
        // match the productID to the selected item inside products array
        let product = products.find(
          (product) => product.Product_ID == productID
        );
        // update cart total price
        grandTotal(+product.Price, false);
        // then decrease the selected item quantity by 1
        product.quantity--;
        // check if this item's quantity is at least one
        if (product.quantity > 0) {
          // update the quantity div's text - go up to productWrapper level, and then find the div with .quantity class
          $(this)
            .closest(".productWrapper") // get the closest productWrapper div
            .find(".quantity") // get the quantity div
            .text(`x ${product.quantity}`); // update the text of the quantity
          // update the shopping cart with reduced quantity on that item
          localStorage.setItem("items", JSON.stringify(products));
          // update cart quantity icon
          const cartQuantity = countCartItems();
          $(".numberOfItems").text(cartQuantity);
          // adjust this items data on checkout page
          if (path.includes("checkout")) {
            $("#shoppingCartTotal").text(
              `Total: $${localStorage.getItem("cartTotalPrice")}.00`
            );
            $(`#checkoutItemQuantity`).text(`${product.quantity}`);
            $(`#${product.Name}TotalPrice`).text(
              `+ $${+product.Price * product.quantity}.00`
            );
          }
        } else {
          // remove this item from checkout page
          if (path.includes("checkout")) {
            $(`#${product.Product_ID}`).remove();
            $("#proceedToCheckout").attr("disabled", true);
            $("#shoppingCartTotal").text(
              `Total: $${localStorage.getItem("cartTotalPrice")}.00`
            );
          }
          // if item in cart becomes zero set quantity to zero
          product.quantity = 0;
          // set shopping cart quantity inidcator to zero
          $(".numberOfItems").text("0");
          // remove item from modal
          $(`#${product.Product_ID}`).remove();
          // find the position of item in products array
          const getItemPositionInCart = products.findIndex(
            (item) => item.Product_ID == product.Product_ID
          );
          // remove item from products array
          products.splice(getItemPositionInCart, 1);
          // check if shopping cart is empty
          if (products.length == 0) {
            // if emtpy reset shopping cart modal and update modal quantity indicator
            localStorage.removeItem("items");
            $(".numberOfItems").text("0");
            $(".modal-body").text("No Items... Please add items to your cart.");
            $("#checkoutItemList").text("Cart is empty.");
            $("#submitCheckout").remove();
            $("#proceedToCheckout").attr("disabled", true);
            $("#shoppingCartFormFieldSet").attr("disabled", true);
          } else {
            // if shopping cart is not empty update the shopping cart (localStorage)
            localStorage.setItem("items", JSON.stringify(products));
            // reset shopping cart icon quantity indicator
            const cartQuantity = countCartItems();
            $(".numberOfItems").text(cartQuantity);
            // $("#proceedToCheckout").attr("disabled", false);
            $("#shoppingCartFormFieldSet").attr("disabled", false);
          }
        }
      });
    }
  });
});
/////////////////////////////////////////////////////////////////////////////
// function that counts how many items are in the shopping cart (localStorage)
/////////////////////////////////////////////////////////////////////////////
function countCartItems() {
  // initialize item count to zero
  cartQuantity = 0;

  // fetch the array of items in the shopping cart
  const getItems = JSON.parse(localStorage.getItem("items"));
  // for each item in the cart sum up the "quantity" property for each item
  getItems.forEach((item) => {
    cartQuantity += item.quantity;
  });

  return cartQuantity;
}

/////////////////////////////////////////////////////////////////////////////
// function that totals up the items in the shopping cart from (localStorage)
/////////////////////////////////////////////////////////////////////////////

function grandTotal(price, increase) {
  if (localStorage.getItem("cartTotalPrice")) {
    let currentTotal = +localStorage.getItem("cartTotalPrice");
    let newTotal;
    if (increase) {
      newTotal = currentTotal + price;
    } else {
      newTotal = currentTotal - price;
      if (newTotal == 0) {
        localStorage.removeItem("cartTotalPrice");
        $(".modal-cart-total").empty();
        return;
      }
    }
    $(".modal-cart-total").text(`Grand total: $${newTotal}.00`);
    localStorage.setItem("cartTotalPrice", newTotal);
  } else {
    $(".modal-cart-total").text(`Grand total: $${price}.00`);
    localStorage.setItem("cartTotalPrice", price);
  }
}

/////////////////////////////////////////////////////////////////////////////
// function that displays the shopping cart total (localStorage)
/////////////////////////////////////////////////////////////////////////////

function displayGrandTotal() {
  if (localStorage.getItem("cartTotalPrice")) {
    let grandTotal = localStorage.getItem("cartTotalPrice");
    $(".modal-cart-total").empty().text(`Grand total: $${grandTotal}.00`);
  }
}
