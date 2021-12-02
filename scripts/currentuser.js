class CurrentUser {
  constructor(storage) {
    this.storage = storage
    this.currentUser = this.loadCurrentUser() || ''
    this.isUserLogged()
    this.setCurrentUser()
  }

  loadCurrentUser() {
    return this.storage.get('#currentUser')
  }

  isUserLogged() {
    if (!this.currentUser) location.replace('../index.html')
  }

  setCurrentUser() {
    const currentUserPlaceholder = document.querySelector('.user-name--js')
    currentUserPlaceholder.textContent = this.currentUser
  }

  resetCurrentUser() {
    this.storage.set('#currentUser', '')
    this.currentUser = ''
  }
}
