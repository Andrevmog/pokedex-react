import { useQuery } from '@tanstack/react-query';
import { fetchPokemons, fetchAllPokemonNames } from '../api/pokemonService';

export const useAllPokemonNames = () => {
  return useQuery(['allPokemonNames'], fetchAllPokemonNames, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
