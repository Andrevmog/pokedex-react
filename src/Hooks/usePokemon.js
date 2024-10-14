import { useQuery } from 'react-query';
import { getPokemonDetails } from '../services/pokeapi';

export const usePokemon = (pokemonName) => {
  return useQuery(['pokemon', pokemonName], () => getPokemonDetails(pokemonName), {
    enabled: !!pokemonName,
  });
};
