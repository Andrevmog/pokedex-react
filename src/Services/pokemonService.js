import axios from "axios";

// Função para buscar Pokémons com parâmetros gerais
const fetchPokemons = async (limit = 40, offset = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    const { data } = await axios.get(url);
    return data;
};

// Função para buscar dados de um Pokémon específico usando nome ou ID
const fetchPokemonData = async (identifier) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${identifier}`; // Exemplo: 'pikachu' ou '25'
    const { data } = await axios.get(url);
    return data;
};

const fetchPokemonEncounters = async (name) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/encounters`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados de encontros');
    }
    return await response.json();
  };

  export { fetchPokemons, fetchPokemonData, fetchPokemonEncounters };