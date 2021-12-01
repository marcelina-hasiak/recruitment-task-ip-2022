class FormValidator {
  static errorMsg = {
    namePatternError:
      'Nazwa musi zawierać co najmniej 4 litery, może zawieraż cyfry oraz znaki specjalne: - _ [ ]  /',
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

  handleFormSubmitting = (e) => {
    e.preventDefault()

    if (this.form.id === 'login-form') {
      this.clearFormInputs()
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

  clearFormInputs() {
    this.inputs.forEach((input) => this.removeErrorMessage(input))
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

class AppStorage {
  constructor() {
    this.storage = localStorage
  }

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  get(key) {
    const data = this.storage.getItem(key)
    return JSON.parse(data)
  }

  remove(key) {
    this.storage.removeItem(key)
  }
}

class StorageValidator {
  static errorMsg = {
    namePatternError: 'Nazwa użytkownika jest już zajęta.',
    emailPatternError:
      'Możesz przypisać tylko jedno konto do adresu mailowego.',
    nameStorageError: 'Użytkownik o podanej nazwie nie istnieje.',
    passwordStorageError: 'Podane hasło jest niepoprawne.',
  }

  static regexPatterns = {
    emailPattern: /(\+[\w\d.-]*)(?:@)/,
  }

  constructor(storage, inputs, formType) {
    this.storage = storage
    this.inputs = inputs
    this.formType = formType
    this.subscribers = {}
    this.userNames = this.loadUserNames() || []
    this.userEmails = this.loadUserEmails() || []
    this.currentUser = this.loadCurrentUser() || ''
  }

  validateStorageData() {
    const [name, password, email] = this.inputs

    switch (this.formType) {
      case 'registration-form':
        if (this.isUserNameExist(name)) {
          this.subscribers.createErrorMessage(
            name,
            StorageValidator.errorMsg.namePatternError,
          )
          return
        }

        if (this.isUserEmailExist(email)) {
          this.subscribers.createErrorMessage(
            email,
            StorageValidator.errorMsg.emailPatternError,
          )
          return
        }
        this.addUser(name, password, email)
        this.subscribers.getAccessToGatedContent()
        break

      case 'login-form':
        const user = this.storage.get(`${name.value.toLowerCase()}`)

        if (!user) {
          this.subscribers.createErrorMessage(
            name,
            StorageValidator.errorMsg.nameStorageError,
          )
          return
        }

        const hashedPassword = this.hashing(password.value)

        if (user.password !== hashedPassword) {
          this.subscribers.createErrorMessage(
            password,
            StorageValidator.errorMsg.passwordStorageError,
          )
          return
        }

        this.setCurrentUser(name)
        this.subscribers.getAccessToGatedContent()
        break
    }
  }

  loadUserNames() {
    return this.storage.get('#names')
  }

  loadUserEmails() {
    return this.storage.get('#emails')
  }

  loadCurrentUser() {
    return this.storage.get('#currentUser')
  }

  isUserNameExist(name) {
    return this.userNames.includes(name.value)
  }

  isUserEmailExist(email) {
    const pureEmailAdress = this.removeAlias(email.value)
    return this.userEmails.includes(pureEmailAdress)
  }

  addUser(name, password, email) {
    const nameWithLowerCase = name.value.toLowerCase()
    const hashedPassword = this.hashing(password.value)
    const pureEmailAdress = this.removeAlias(email.value)

    this.storage.set(nameWithLowerCase, {
      name: name.value,
      password: hashedPassword,
      email: pureEmailAdress
    })

    this.setNames(name)
    this.setEmails(pureEmailAdress)
    this.setCurrentUser(name)
  }

  setCurrentUser(name) {
    this.currentUser = name.value
    this.storage.set('#currentUser', this.currentUser)
  }

  setNames(name) {
    this.userNames.push(name.value)
    this.storage.set('#names', this.userNames)
  }

  setEmails(email) {
    this.userEmails.push(email)
    this.storage.set('#emails', this.userEmails)
  }

  removeAlias(email) {
    const match = StorageValidator.regexPatterns.emailPattern.exec(email)
    return !match ?  email : email.replace(match[1], "")
  }

  hashing(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash &= hash
    }
    return new Uint32Array([hash])[0].toString(36);
    //taken from: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
  };

  subscribe(subscribers) {
    this.subscribers = { ...this.subscribers, ...subscribers }
  }
}

class AppController {
  constructor() {
    this.initializeFormValidator()
  }

  initializeFormValidator() {
    const form = document.forms[0]
    this.formValidator = new FormValidator(form)
    this.formValidator.subscribe(this.initializeStorageValidator)
  }

  createErrorMessage = (input, msg) => {
    this.formValidator.createErrorMessage(input, msg)
  }

  getAccessToGatedContent = () => {
    location.replace(
      '../pages/gated-content.html'
    )
  }

  initializeStorageValidator = (inputs, formType) => {
    const storage = new AppStorage()
    this.storageValidator = new StorageValidator(storage, inputs, formType)
    this.storageValidator.subscribe({
      createErrorMessage: this.createErrorMessage,
      getAccessToGatedContent: this.getAccessToGatedContent,
    })
    this.storageValidator.validateStorageData()
  }
}

const appController = new AppController()
