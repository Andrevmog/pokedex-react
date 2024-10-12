import React from 'react';
import PokemonList from '../Components/pokemonList';

const Home = () => {
  return (
    <div class='flex justify-items-center align-middle w-full gap-2'>
        <PokemonList></PokemonList>
    </div>
  );
};

export default Home;