class FormController {
  constructor() {
    this.initializeFormValidator()
  }

  initializeFormValidator() {
    const form = document.forms[0]
    this.formValidator = new FormValidator(form)
    this.formValidator.subscribe(this.initializeStorageValidator)
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

  createErrorMessage = (input, message) => {
    this.formValidator.createErrorMessage(input, message)
  }

  getAccessToGatedContent = () => {
    location.replace('../pages/gated-content.html')
  }
}

new FormController()
