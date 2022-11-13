// https://api.rawg.io/docs/#tag/games
// api request key
const key = "9ae81c1ca74349b5ab70a01ffa65bd3b";

async function getThreeRandomGamesData() {
  const games = [];
  const categories = ["action", "sports"];
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < 3; j++) {
      let getRandomPageNumber = Math.floor(Math.random() * 500);
      let getRandomGameObjectNumber = Math.floor(Math.random() * 20);
      const pageDataAPI = await fetch(
        `https://api.rawg.io/api/games?genres=${categories[i]}&key=${key}&page=${getRandomPageNumber}`
      );
      const pageData = await pageDataAPI.json();
      const getSingleGameObject = pageData.results[getRandomGameObjectNumber];
      getSingleGameObject.Price = "25";
      getSingleGameObject.Product_ID = getSingleGameObject.id;
      getSingleGameObject.genre = categories[i];
      getSingleGameObject.quantity;
      games.push(getSingleGameObject);
    }
  }
  return games;
}

//////////////////////////////////////////////////////////////
// process of filtering and applying games to products page
//////////////////////////////////////////////////////////////
getThreeRandomGamesData().then((data) => {
  // place each game object into variable
  const allGames = data;
  // create list of shop categories then loop over them to display each product within it's respective category
  const category = ["action", "sports"];
  for (let i = 0; i < category.length; i++) {
    // filter out other categories from all goblin data
    const games = allGames.filter((item) => item.genre == category[i]);
    // get the element to which to append each goblin product
    const productsCardsContainer = document.getElementById(
      `${category[i]}-group`
    );
    // loop through goblins object to create and apply that goblin to the shop page
    games.forEach((game) => {
      // create object of arguments for func arguments destructuring
      const thisCardsParams = {
        product: game,
        appendTo: productsCardsContainer,
        name: game.name,
        price: game.Price,
        id: game.Product_ID,
        image: game.background_image,
        rating: game.genre,
        releaseDate: game.released,
      };
      // function that creates container to hold this games card
      addGamesCard(thisCardsParams);
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
    // remove ..loading message
    let loader = document.getElementById(`${category[i]}-loader`);
    loader.remove();
  }
});

//////////////////////////////////////////////////////////////
// create each games card
//////////////////////////////////////////////////////////////
function addGamesCard({
  appendTo,
  name,
  price,
  id,
  image,
  rating,
  releaseDate,
}) {
  // create container to hold this goblins card
  const cardContainer = document.createElement("div");
  cardContainer.classList = "card";
  // create card (card body) for this game
  const cardBody = document.createElement("div");
  cardBody.classList = "card-body";
  // create the description and price for this game
  const cardText = document.createElement("p");
  cardText.classList = "card-text";
  cardText.innerHTML = `${name} Game<br>Released: ${
    releaseDate ?? "unkown"
  }<br>$${price}`;
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
            <strong class="me-auto">${rating} games</strong>
            <small class="text-dark">non stop ${rating}!</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${name} added to cart!
          </div>
        </div>
      </div>
          `;
  // create the image element and apply attributes including the img source
  const gameImage = document.createElement("img");
  gameImage.src = image;
  gameImage.classList = "card-img-top mymodal";
  gameImage.alt = `No available picture for ${name}`;
  // append the card to holding container
  cardContainer.append(cardBody);
  // append information text to the card
  cardBody.append(cardText);
  // append goblins image to the card
  cardContainer.append(gameImage);
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
    const getThisItem = getCart.find((thisGame) => thisGame.Product_ID == id);
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
