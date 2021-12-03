class GatedContentController {
  constructor() {
    this.characterWrapper = document.querySelector('.characters-wrapper--js')
    this.initializeStorageValidator()
    this.initializeAPIRequest()
    this.initializeCharacterButton()
    this.initializeLogOutButton()
  }

  initializeStorageValidator() {
    const storage = new AppStorage()
    this.currentUser = new CurrentUser(storage)
  }

  initializeAPIRequest() {
    const apiAdress = 'https://rickandmortyapi.com/api/character'
    new APIRequest(apiAdress, this.characterWrapper)
  }

  initializeCharacterButton() {
    this.characterWrapper.addEventListener(
      'click',
      this.handleCharacterActivation,
    )
    this.characterWrapper.addEventListener(
      'keypress',
      this.handleCharacterActivation,
    )
  }

  initializeLogOutButton() {
    const logOutButton = document.querySelector('.log-out--js')
    logOutButton.addEventListener('click', this.handleLogOut)
  }

  handleCharacterActivation = (event) => {
    if (!event.keyCode === 13) return
    const img = event.target.closest('img')
    if (!img) return
    if (!this.characterWrapper.contains(img)) return
    

    const characterMeta = img
      .closest('.character-wrapper--js')
      .querySelector('.character-meta-wrapper--js')
    characterMeta.classList.toggle('hidden')
  }

  handleLogOut = () => {
    this.currentUser.resetCurrentUser()
    location.replace('../index.html')
  }
}

new GatedContentController()
