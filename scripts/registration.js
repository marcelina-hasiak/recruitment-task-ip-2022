class FormValidator {
  constructor(form, inputWrappers, inputs) {
    this.form = form
    this.inputWrappers = inputWrappers
    this.inputs = inputs
    this.form.addEventListener('submit', this.handleValidation)
  }

  handleValidation = (e) => {
    e.preventDefault()
    const isFormValidated = this.validateInputs()
  }

  validateInputs() {
    this.inputs
      .map((input, index) => {
        this.removeErrorMessage(input)
        switch (input.id) {
          case 'name':
            return this.validateName(input)
          case 'password':
            return this.validatePassword(input)
          case 'email':
            return this.validateEmail(input)
          case 'confirm-email':
            return this.validateEmailConfirmation(this.inputs[index - 1], input)
        }
      })
      .every((el) => el === true)
  }

  createErrorMessage(input, errorMessage) {
    const errorElement = document.createElement('p')
    errorElement.classList.add('error-message')
    errorElement.textContent = errorMessage
    this.inputWrappers[input.id].appendChild(errorElement)
  }

  removeErrorMessage(input) {
    const messageToRemove = this.inputWrappers[input.id].querySelector(
      '.error-message',
    )
    if (messageToRemove != null) messageToRemove.remove()
  }

  validateName(inputName) {
    const regex = /^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])[A-Za-z\d\-\_\[\]\\\/]+$/
    const notification =
      'Nazwa musi zawierać co najmniej 4 litery, może zawieraż cyfry oraz znaki specjalne: - _ [ ]  /'
    const isNameValid = regex.test(inputName.value)
    if (!isNameValid) {
      this.createErrorMessage(inputName, notification)
      return false
    } else {
      return true
    }
  }

  validatePassword(password) {
    return password.checkValidity()
  }

  validateEmail(emailInput) {
    const regex = /^[a-z\d]+[\w\d.-]*(\+[\w\d.-]*)?@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i
    const notification = 'Wprowadź prawidłowy adres email'
    const isEmailValid = regex.test(emailInput.value)
    if (!isEmailValid) {
      this.createErrorMessage(emailInput, notification)
      return false
    } else {
      return true
    }
  }

  validateEmailConfirmation(emailInput, emailConfirmationInput) {
    const notification = 'Adres email musi być taki sam'
    if (emailInput.value !== emailConfirmationInput.value) {
      this.createErrorMessage(emailConfirmationInput, notification)
      return false
    } else {
      return true
    }
  }
}

const registrationForm = document.querySelector('#registration-form')
const registartionInputWrappers = Array.from(
  document.querySelectorAll('[data-input-wrapper]'),
).reduce((acc, cur) => ({ ...acc, [cur.dataset.inputWrapper]: cur }), {})
const registartionInputs = Array.from(
  document.querySelectorAll('input:not([type=submit])'),
)

const formValidator = new FormValidator(
  registrationForm,
  registartionInputWrappers,
  registartionInputs,
)

