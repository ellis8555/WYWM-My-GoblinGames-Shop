// get each goblins object from json file
async function getGoblinData() {
  const fetchGoblinData = await fetch("../json/goblinData.json");
  const goblinData = await fetchGoblinData.json();
  return goblinData;
}

//////////////////////////////////////////////////////////////
// process of filtering and applying gold goblins to shop page
//////////////////////////////////////////////////////////////
getGoblinData().then((data) => {
  // place each goblin object into variable
  const allProducts = data.Goblins;
  // create list of shop categories then loop over them to display each product within it's respective category
  const category = ["Gold", "Silver", "Bronze"];
  for (let i = 0; i < category.length; i++) {
    // filter out other categories from all goblin data
    const goblins = allProducts.filter((item) => item.Rating == category[i]);
    // get the element to which to append each goblin product
    const shopCardsContainer = document.getElementById(`${category[i]}-group`);
    // loop through goblins object to create and apply that goblin to the shop page
    goblins.forEach((goblin) => {
      // create object of arguments for func arguments destructuring
      const thisCardsParams = {
        product: goblin,
        appendTo: shopCardsContainer,
        name: goblin.Name,
        price: goblin.Price,
        id: goblin.Product_ID,
        image: goblin.imgPath,
        rating: goblin.Rating,
      };
      // function that creates container to hold this goblins card
      addGoblinsCard(thisCardsParams);
      // script to activate bootstrap toast when button "Add item" is pressed
      const toastTrigger = document.getElementById(
        `add${thisCardsParams.id}Toast`
      );
      const toastLiveExample = document.getElementById(
        `live${thisCardsParams.id}Toast`
      );
      if (toastTrigger) {
        toastTrigger.addEventListener("click", () => {
          const toast = new bootstrap.Toast(toastLiveExample);
          toast.show();
          // function that adds to cart (localStorage)
          addToCart(thisCardsParams);
        });
      }
    });
  }
});

//////////////////////////////////////////////////////////////
// create each goblins card
//////////////////////////////////////////////////////////////
function addGoblinsCard({ appendTo, name, price, id, image, rating }) {
  // create container to hold this goblins card
  const cardContainer = document.createElement("div");
  cardContainer.classList = "card";
  // create card (card body) for this goblin
  const cardBody = document.createElement("div");
  cardBody.classList = "card-body";
  // create the description and price for this goblin
  const cardText = document.createElement("p");
  cardText.classList = "card-text";
  cardText.innerHTML = `${name} Goblin<br>$${price}`;
  // create "Add item" button
  const btnAddItem = document.createElement("button");
  btnAddItem.id = `add${id}Toast`;
  btnAddItem.classList = "btn btn-primary mt-1 mb-2 mx-3";
  btnAddItem.dataset.productid = `${id}`;
  btnAddItem.innerHTML = "Add item";
  // add toast div
  const toastDiv = document.createElement("div");
  toastDiv.id = `add${id}Toast`;
  // bootstrap html for toast.
  toastDiv.innerHTML = `
     <div class="toast-container position-fixed top-0 start-50 translate-middle-x  p-3">
        <div id="live${id}Toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header"> 
            <strong class="me-auto">${rating} $ale</strong>
            <small class="text-dark">${rating} goblin</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${name} goblin added to cart!
          </div>
        </div>
      </div>
          `;
  // create the image element and apply attributes including the img source
  const goblinImage = document.createElement("img");
  goblinImage.src = image;
  goblinImage.classList = "card-img-top mymodal";
  goblinImage.alt = `Picture of ${name} Goblin`;
  // append the card to holding container
  cardContainer.append(cardBody);
  // append information text to the card
  cardBody.append(cardText);
  // append goblins image to the card
  cardContainer.append(goblinImage);
  // append btn add item to the card
  cardContainer.append(btnAddItem);
  // append the toast div
  cardContainer.append(toastDiv);
  // append whole goblins card to the page
  appendTo.append(cardContainer);
}

//////////////////////////////////////////////////////////////
// create function to add item to cart (localStorage)
//////////////////////////////////////////////////////////////
function addToCart({ product, id, price }) {
  // check if goblin already in cart
  if (localStorage.getItem("items")) {
    // if in cart add plus one to qty
    let getCart = JSON.parse(localStorage.items);
    const getThisItem = getCart.find(
      (thisGoblin) => thisGoblin.Product_ID == id
    );
    if (getThisItem) {
      ++getThisItem.quantity;
    } else {
      product.quantity = 1;
      getCart.push(product);
    }
    localStorage.setItem("items", JSON.stringify(getCart));
  } else {
    // if goblin not in cart add this goblin object with qty and image path
    let items = [];
    product.quantity = 1;
    items.push(product);
    localStorage.setItem("items", JSON.stringify(items));
    $("#proceedToCheckout").attr("disabled", false);
  }
  // update cart total price
  grandTotal(+price, true);
  // update shopping cart item quantity indicator
  const cartQuantity = countCartItems();
  $(".numberOfItems").text(cartQuantity);
}

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
    $(".modal-cart-total").text(`Grand total: $${newTotal}`);
    localStorage.setItem("cartTotalPrice", newTotal);
  } else {
    $(".modal-cart-total").text(`Grand total: $${price}`);
    localStorage.setItem("cartTotalPrice", price);
  }
}
