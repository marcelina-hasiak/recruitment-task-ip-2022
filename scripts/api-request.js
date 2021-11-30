class GatedContentController {
  constructor() {
    this.isUserLogged()
    this.setCurrentUser()
    this.getCharacters()
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
    const characterWrapper = document.querySelector('.characters-wrapper')
    data.forEach(character => this.createCharacterHtmlElement(characterWrapper, character))
  }

  createCharacterHtmlElement(dataWrapper, data) {
    const {gender, image, name, species, status} = data
    const markup = `
    <div>
      <div>
        <img class="character-image" src="${image}" alt="${name}">
      </div>
      <h2>${name}</h2>
      <p class="character-meta">gender: ${gender}</p>
      <p class="character-meta">species: ${species}</p>
      <p class="character-meta">status: ${status}</p>
    </div>
    `
    dataWrapper.insertAdjacentHTML("beforeend", markup)
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
