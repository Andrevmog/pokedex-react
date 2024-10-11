import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Card from '../Components/Card'

const fetchPokemons = async () => {
    const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=50");
    return data;
};
function PokemonList() {
    const { data, status } = useQuery("pokemons", fetchPokemons);
    const PokemonCard = (pokemons) => {
        return pokemons.results.map((pokemon) => {
            return <Card name={pokemon.name}>{pokemon.name}</Card>;
        });
    };
    return (
        <div class='flex gap-3 w-full'>
            {status === "loading" && <div>Loading...</div>}
            {status === "error" && <div>Error fetching pokemons</div>}
            {status === "success" && <div class='flex align-middle justify-center w-full h-full gap-8 flex-wrap'>{PokemonCard(data)}</div>}
        </div>
    );
}
export default PokemonList;