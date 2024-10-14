// src/hooks/useAllPokemonNames.js

import { useQuery } from '@tanstack/react-query';
import { fetchAllPokemonNames } from '../Services/pokemonService';

export const useAllPokemonNames = () => {
  return useQuery({
    queryKey: ['allPokemonNames'],
    queryFn: fetchAllPokemonNames,
  });
};
