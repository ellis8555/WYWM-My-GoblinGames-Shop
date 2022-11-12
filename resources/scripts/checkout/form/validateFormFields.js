// reg expressions for form validation checks
const namePattern = /[\s]?[a-zA-Z-]{2,}[\s]{0,2}$/;
const emailPattern = /[\w-]+@[\w-]+\.?[\w-]*\.[a-zA-Z]{2,3}$/;
const creditCardPattern = /\d{4}-\d{4}-\d{4}-\d{4}$/;

// bools object indicating which form fields are validated
const fieldValidations = {
  firstnameValidated: false,
  lastnameValidated: false,
  emailValidated: false,
  creditCardValidated: false,
};

// validation checks for first/last name inputs
["firstname", "lastname"].forEach((field) => {
  const nameField = document.getElementById(field);
  nameField.addEventListener("keyup", () => {
    const validationBool = `${field}Validated`;
    validateForm(nameField, namePattern, validationBool);
  });
});

// validation check for email field
const email = document.getElementById("email");
email.addEventListener("keyup", () => {
  const validationBool = "emailValidated";
  validateForm(email, emailPattern, validationBool);
});

// validation check for credit card field
const creditCard = document.getElementById("ccn");
creditCard.addEventListener("keyup", () => {
  const validationBool = "creditCardValidated";
  validateForm(creditCard, creditCardPattern, validationBool);
});

////////////////////////////////////////////////////////
// function to run to check each fields input validation
////////////////////////////////////////////////////////
function validateForm(InputElement, pattern, validationBool) {
  // get the input element
  const inputValue = InputElement.value;

  // function to run if InputElement is credit card input
  insertDashesIntoCreditCardNumber(InputElement, inputValue);

  // styles to set for different states of the validation process
  const emptyInput = "form-control";
  const valid = "form-control is-valid";
  const invalid = "form-control is-invalid";

  // check the pattern
  const patternCheck = inputValue.match(pattern) || [];

  // check if field is empty (starting point or backspace to empty)
  if (inputValue.length == 0) {
    InputElement.classList = emptyInput;
    fieldValidations[validationBool] = false;
    // check if user input is valid
  } else if (patternCheck.length != 0) {
    InputElement.classList = valid;
    // set this fields validation to 'true' in 'fieldValidations' object
    fieldValidations[validationBool] = true;
    // invalid user input
  } else {
    InputElement.classList = invalid;
    fieldValidations[validationBool] = false;
  }

  // check if all form fields have been validated
  getValidationsForEachField(fieldValidations);
}

///////////////////////////////////////////////////////
// function to insert "-" between credit cards set of numbers
///////////////////////////////////////////////////////
function insertDashesIntoCreditCardNumber(inputElement, inputValue) {
  // check if credit card input field has focus
  if (inputElement == creditCard) {
    const currentPosition = inputValue.length;
    // array of position numbers where dash's belong
    const dashPositions = [4, 9, 14];
    // get the current position of the cursor relating to "dashPositions"
    if (dashPositions.includes(currentPosition)) {
      // check if user is pressing "Backspace" button to properly remove dash's
      if (event.key == "Backspace") {
        inputValue = inputValue.slice(0, currentPosition);
        inputElement.inputValue = inputValue;
      } else {
        // if user is not using "Backspace" button and position is where a dash belongs then insert a dash
        inputValue = inputValue + "-";
        inputElement.value = inputValue;
      }
    }
  }
  return;
}

///////////////////////////////////////////////////////////////////////////////////////
// function to get each fields validation confirmation needed for submit button enabled
///////////////////////////////////////////////////////////////////////////////////////

// fieldValidations object properties passed as argument
function getValidationsForEachField({
  firstnameValidated,
  lastnameValidated,
  emailValidated,
  creditCardValidated,
}) {
  const submitOrderButton = document.querySelector("#submitOrder");
  // if all three form fields are validated then enable checkout submit button
  if (
    firstnameValidated &&
    lastnameValidated &&
    emailValidated &&
    creditCardValidated
  ) {
    submitOrderButton.disabled = false;
  } else {
    submitOrderButton.disabled = true;
  }
}
