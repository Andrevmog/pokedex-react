import axios from "axios";

// Função para buscar Pokémon
const fetchPokemons = async (url) => {
    const { data } = await axios.get(url);
    return data;
};

// Função para buscar dados de um Pokémon específico
const fetchPokemonData = async (url) => {
    const { data } = await axios.get(url);
    return data;
};

export { fetchPokemons, fetchPokemonData };