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
        if (this.isUserNameTaken(name)) {
          this.subscribers.createErrorMessage(
            name,
            StorageValidator.errorMsg.namePatternError,
          )
          return
        }

        if (this.isUserEmailTaken(email)) {
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

        const hashedPassword = this.hashValue(password.value)

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

  isUserNameTaken(name) {
    return this.userNames.includes(name.value)
  }

  isUserEmailTaken(email) {
    const pureEmailAdress = this.removeAlias(email.value)
    return this.userEmails.includes(pureEmailAdress)
  }

  addUser(name, password, email) {
    const nameWithLowerCase = name.value.toLowerCase()
    const hashedPassword = this.hashValue(password.value)
    const pureEmailAdress = this.removeAlias(email.value)

    this.storage.set(nameWithLowerCase, {
      name: name.value,
      password: hashedPassword,
      email: pureEmailAdress,
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
    return !match ? email : email.replace(match[1], '')
  }

  hashValue(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash &= hash
    }
    return new Uint32Array([hash])[0].toString(36)
  }

  subscribe(subscribers) {
    this.subscribers = { ...this.subscribers, ...subscribers }
  }
}
