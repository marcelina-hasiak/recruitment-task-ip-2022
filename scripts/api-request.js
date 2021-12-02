class APIRequest {
  constructor(apiAdress, apiDataHtmlWrapper) {
    this.apiAdress = apiAdress
    this.apiDataHtmlWrapper = apiDataHtmlWrapper
    this.getCharacters()
  }

  async getCharacters() {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character')
      const data = await response.json()
      this.renderAPIdata(data.results)
    } catch (error) {
      console.log('error', error)
    }
  }

  renderAPIdata(data) {
    data.forEach((character) =>
      this.createCharacterHtmlElement(this.apiDataHtmlWrapper, character),
    )
  }

  createCharacterHtmlElement(dataWrapper, data) {
    const { gender, image, name, species, status } = data
    const markup = `
    <div class="character-wrapper--js">
      <div>
        <img class="character-image" src="${image}" alt="${name}">
      </div>
      <h2 lang="en">${name}</h2>
      <button class="character-button character-button--js">Klikaj tu</button>
      <div class="character-meta-wrapper--js hidden">
        <p class="character-meta">płeć: 
          <span lang="en"> ${gender}<span>
        </p>
        <p class="character-meta">gatunek:
          <span lang="en"> ${species}<span>
        </p>
        <p class="character-meta">status:
          <span lang="en"> ${status}<span>
        </p>
      </div>
    </div>
    `
    dataWrapper.insertAdjacentHTML('beforeend', markup)
  }
}
