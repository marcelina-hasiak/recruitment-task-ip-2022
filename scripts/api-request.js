class GatedContentController {
  constructor() {
    this.isUserLogged()
    this.setCurrentUser()
    this.characterWrapper = document.querySelector('.characters-wrapper--js')
    this.getCharacters()
    this.initializeCharacterButton()
    this.initializeLogOutButton()
  }

  isUserLogged() {
    const currentUser = this.getCurrentUser()
    !currentUser ? location.replace('../index.html') : this.currentUser = currentUser
  }

  getCurrentUser() {
    const data = localStorage.getItem('#currentUser')
    return JSON.parse(data)
  }

  setCurrentUser() {
    const currentUserLabel = document.querySelector('#user-name')
    currentUserLabel.textContent = this.currentUser
  }

  async getCharacters() {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character')
      const data = await response.json()
      this.renderAPIdata(data.results) 
    } catch(e) {
      console.log('error', e)
    }
  }

  renderAPIdata(data) {
    data.forEach(character => this.createCharacterHtmlElement(this.characterWrapper, character))
  }

  createCharacterHtmlElement(dataWrapper, data) {
    const {gender, image, name, species, status} = data
    const markup = `
    <div class="character-wrapper--js">
      <div>
        <img class="character-image" src="${image}" alt="${name}">
      </div>
      <h2 lang="en">${name}</h2>
      <button class="character-button character-button--js">Klikaj tu</button>
      <div class="character-meta-wrapper--js hidden">
        <p lang="en" class="character-meta">gender: ${gender}</p>
        <p lang="en" class="character-meta">species: ${species}</p>
        <p lang="en" class="character-meta">status: ${status}</p>
      </div>
    </div>
    `
    dataWrapper.insertAdjacentHTML("beforeend", markup)
  }

  initializeCharacterButton() {
    this.characterWrapper.addEventListener('click', this.handleCharacterActivation)
  }

  handleCharacterActivation = (e) => {
    const button = e.target.closest('button')
    if (!button) return
    if (!this.characterWrapper.contains(button)) return

    const characterMeta = button.closest('.character-wrapper--js').querySelector('.character-meta-wrapper--js')
    characterMeta.classList.toggle('hidden')
  }

  initializeLogOutButton() {
    const logOutButton = document.querySelector('#log-out')
    logOutButton.addEventListener('click', this.handleLogOut)
  }

  handleLogOut = () => {
    this.resetCurrentUser()
    location.replace('../index.html')
  }

  resetCurrentUser() {
    localStorage.setItem('#currentUser', JSON.stringify(''))
    this.currentUser = ''
  }
}

new GatedContentController()
