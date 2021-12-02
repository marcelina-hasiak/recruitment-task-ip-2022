class FormValidator {
  static errorMsg = {
    namePatternError:
      'Nazwa musi zawierać co najmniej 4 litery, może zawieraż cyfry oraz znaki specjalne: - _ [ ] / \\',
    emailPatternError: 'Wprowadź prawidłowy adres email',
    emailConfirmationPatternError: 'Adres email musi być taki sam',
  }

  static regexPatterns = {
    namePattern: /^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])[A-Za-z\d\-\_\[\]\\\/]+$/,
    emailPattern: /^[a-z\d]+[\w\d.-]*(\+[\w\d.-]*)?@(?:[a-z\d]+[a-z\d-]+\.){1,5}[a-z]{2,6}$/i,
  }

  constructor(form) {
    this.form = form
    this.inputs = FormValidator.nodeListToArray(
      document.querySelectorAll('input:not([type=submit])'),
    )
    this.form.addEventListener('submit', this.handleFormSubmitting)
    this.subscribers = []
  }

  static nodeListToArray(nodeList) {
    return Array.from(nodeList)
  }

  handleFormSubmitting = (event) => {
    event.preventDefault()

    if (this.form.id === 'login-form') {
      this.inputs.forEach((input) => this.removeErrorMessage(input))
      this.subscribers.forEach((subscriber) =>
        subscriber(this.inputs, this.form.id),
      )
      return
    }

    const isFormValid = this.validateInputs()

    if (isFormValid) {
      this.subscribers.forEach((subscriber) =>
        subscriber(this.inputs, this.form.id),
      )
    }
  }

  validateInputs() {
    return this.inputs
      .map((input, index) => {
        this.removeErrorMessage(input)
        switch (input.id) {
          case 'name':
            return this.validateAgainstPattern(input)
          case 'password':
            return this.validatePassword(input)
          case 'email':
            return this.validateAgainstPattern(input)
          case 'confirm-email':
            return this.validateEmailConfirmation(this.inputs[index - 1], input)
        }
      })
      .every((el) => el === true)
  }

  getErrorWrapper(input) {
    return input.closest(`[data-input-wrapper = ${input.id}]`)
  }

  createErrorMessage(input, errorMessage) {
    const errorElement = document.createElement('p')
    errorElement.classList.add('error-message')
    errorElement.textContent = errorMessage
    this.getErrorWrapper(input).appendChild(errorElement)
  }

  removeErrorMessage(input) {
    const messageToRemove = this.getErrorWrapper(input).querySelector(
      '.error-message',
    )
    if (messageToRemove !== null) messageToRemove.remove()
  }

  validateAgainstPattern(input) {
    const regex = FormValidator.regexPatterns[`${input.id}Pattern`]
    const isNameValid = regex.test(input.value)
    if (!isNameValid) {
      this.createErrorMessage(
        input,
        FormValidator.errorMsg[`${input.id}PatternError`],
      )
      return false
    } else {
      return true
    }
  }

  validatePassword(password) {
    return password.checkValidity()
  }

  validateEmailConfirmation(emailInput, emailConfirmationInput) {
    if (emailInput.value !== emailConfirmationInput.value) {
      this.createErrorMessage(
        emailConfirmationInput,
        FormValidator.errorMsg.emailConfirmationPatternError,
      )
      return false
    } else {
      return true
    }
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber)
  }
}
