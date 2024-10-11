import React from 'react';
import PokemonList from './PokemonList';

const Home = () => {
  return (
    <div class='flex justify-items-center align-middle w-full gap-2'>
        <PokemonList></PokemonList>
    </div>
  );
};

export default Home;