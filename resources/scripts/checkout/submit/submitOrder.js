import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// object containing form element selectors and whats currently in the cart. This object passed newCustOrder() and sendMail() as arguments
const orderDetails = {
  // form first name field
  custFirstName: document.getElementById("firstname"),
  // form last name field
  custLastName: document.getElementById("lastname"),
  // form email field
  custEmail: document.getElementById("email"),
  // form credit card field
  custCreditcard: document.getElementById("ccn"),
  // items currently in cart
  itemsInCart: JSON.parse(localStorage.items),
  // the total price of items in cart
  totalPrice: JSON.parse(localStorage.cartTotalPrice),
};

//////////////////////////////////////////////
// FIREBASE DB
//////////////////////////////////////////////

// send the purchase details to the database
async function newCustOrder({
  custFirstName,
  custLastName,
  custEmail,
  itemsInCart,
  custCreditcard,
  totalPrice,
}) {
  // firebase configuration
  const firebaseConfig = {
    // confidential information removed. attempts to run this pages script will fail without proper keys/id's
    apiKey: "CONFIDENTIAL",
    authDomain: "wywm-goblin-store.firebaseapp.com",
    projectId: "wywm-goblin-store",
    storageBucket: "wywm-goblin-store.appspot.com",
    messagingSenderId: "CONFIDENTIAL",
    appId: "CONFIDENTIAL",
  };

  // init Firebase
  initializeApp(firebaseConfig);

  // init db services
  const db = getFirestore();

  // get the customers details from form
  const custData = {
    email: `${custEmail.value}`,
    firstName: `${custFirstName.value}`,
    lastName: `${custLastName.value}`,
  };

  // create purchase order unique id
  const timeStamp = Date.now();

  // add customers information to database
  await setDoc(doc(db, "customers", `${custEmail.value}`), custData);

  // place itemsInCart from localStorage into object
  const itemsOrdered = {};
  itemsInCart.forEach((item) => {
    itemsOrdered[item.Name || item.name] = item.quantity;
  });

  // object to hold customers purchase order details
  const custThisOrder = {
    items: itemsOrdered,
    totalPrice: totalPrice,
    cardNumber: displayPrivateCcn(custCreditcard.value),
  };

  // add customers purchase order to the database
  await setDoc(
    doc(db, `customers/${custEmail.value}/orders/${timeStamp}`),
    custThisOrder
  );
}

//////////////////////////////////////////////
// EMAIL
//////////////////////////////////////////////

// create email and send to customer upon order confirmation

function createEmail({
  // orderDetails object destructed as paramters
  custFirstName,
  custLastName,
  itemsInCart,
  custCreditcard,
  totalPrice,
}) {
  // get the first/last name and ccn from input fields
  const firstName = custFirstName.value;
  const lastName = custLastName.value;
  const ccn = displayPrivateCcn(custCreditcard.value);

  // items in cart looped through added to body of email
  let itemsPurchased = "";
  itemsInCart.forEach((item) => {
    itemsPurchased += `${item.Name || item.name} X ${item.quantity}\n`;
  });
  // email body message
  let emailMessage = `
Thank you for your purchase ${firstName} ${lastName}!\n
Your items:\n
${itemsPurchased}
Total price: $${totalPrice}.00
 on card ${ccn}`;
  return emailMessage;
}

// sends the email
function sendMail(emailMessage, { custEmail: address }) {
  const params = {
    email: address.value,
    message: emailMessage,
  };

  // key/id's have been removed
  const serviceID = "CONFIDENTIAL";
  const templateID = "CONFIDENTIAL";
  const publicKey = "CONFIDENTIAL";

  emailjs
    .send(serviceID, templateID, params, publicKey)
    .then((res) => {
      resetCart();
    })
    .catch((err) => console.log(err));
}

//////////////////////////////////////////////
// CREDIT CARD PRIVATIZER
//////////////////////////////////////////////

// create hidden credit card number for email
function displayPrivateCcn(cardNumber) {
  const ccn = cardNumber;
  const last4digits = ccn.slice(15);
  const privateCcn = `**** **** **** ${last4digits}`;
  return privateCcn;
}

//////////////////////////////////////////////
// FORM AND CART RESET UPON SUBMIT
//////////////////////////////////////////////

// selects and clears/resets appropriate fields from cart/checkout page
function resetCart() {
  $(".numberOfItems").text("0");
  $(".modal-body").text("No Items... Please add items to your cart.");
  $("#checkoutItemList").text("Cart is empty.");
  $("#submitCheckout").remove();
  $("#proceedToCheckout").attr("disabled", true);
  $("#shoppingCartFormFieldSet").attr("disabled", true);
  localStorage.removeItem("items");
  localStorage.removeItem("cartTotalPrice");
  document.forms[0].reset();
}

//////////////////////////////////////////////////////////////////////////////////
// ASSIGN LISTENER TO SUBMIT ORDER BUTTON
// email and firebase db functions commented out as they require proper key/id's
/////////////////////////////////////////////////////////////////////////////////

// click listener on submit order button
const submitOrderButton = document.querySelector("#submitOrder");
submitOrderButton.addEventListener("click", () => {
  // sendMail(createEmail(orderDetails), orderDetails);
  // newCustOrder(orderDetails);
  alert(
    "Email and firebase db functions located in resources/scripts/checkout/submit/sumbitOrder.js"
  );
});
