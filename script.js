const mainSection = document.querySelector('#mainContent')
let offset = 0
const limit = 10000
allPokemonData = []

async function getData(){

    const url =  `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`

    const response = await fetch(url)
    const data = await response.json()

    console.log(data)

    for(const pokemon of data.results){
        const pokeDetails = await fetch(pokemon.url)
        const pokeData = await pokeDetails.json()

        if(!allPokemonData.find(p => p.id === pokeData.id)){
            allPokemonData.push(pokeData)
        }
    }
    renderPokemon(allPokemonData)
}

function renderPokemon(pokemonList){
    mainSection.innerHTML = ''

    pokemonList.forEach(pokeData =>{
        const newElement = document.createElement('section')
        newElement.className = 'card'
        newElement.id = pokeData.id.toString()

        newElement.addEventListener('click', ()=>{
            localStorage.setItem('id_details', pokeData.id.toString())
            window.location.href = 'details.html'

        })
        newElement.innerHTML = `
        <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
        <h4>Pokémon: ${pokeData.name}</h4>
        <p>Nº: ${pokeData.id}</p>
        <p>Type: ${pokeData.types.map(type => type.type.name).join(', ')}</p>
        <p>Species: ${pokeData.species.name}</p>
    `
    mainSection.appendChild(newElement)
    })
}
function changePage(direction){
    if(direction === 'next'){
        offset += limit
    }else if(direction === 'prev' && offset >= limit){
        offset -= limit
    }
    getData()
}
async function searchPokemon(){
    const query = document.getElementById('pokeSearch').value.toLowerCase().trim()

    if(query ===''){
        renderPokemon(allPokemonData)
        return
    }

    const filteredPokemon = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(query))

    if(filteredPokemon.length > 0){
        renderPokemon(filteredPokemon)
    }else{
        mainSection.innerHTML = '<p>Pokémon não encontrado </p>'
    }    
}

document.getElementById('pokeSearch').addEventListener('input', searchPokemon);

getData();