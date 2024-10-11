import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Card from '../Components/Card';

// Função para buscar Pokémon
const fetchPokemons = async (url) => {
    const { data } = await axios.get(url);
    return data;
};

function PokemonList() {
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/?limit=20");
    const { data, status } = useQuery(["pokemons", url], () => fetchPokemons(url));

    // Renderizar cartões de Pokémon
    const renderPokemonCards = (pokemons) => {
        // Verifica se pokemons e results existem
        if (!pokemons || !pokemons.results) {
            return null; // Ou um carregamento ou uma mensagem de erro
        }

        return pokemons.results.map((pokemon) => (
            <Card key={pokemon.name} pokemon={pokemon} />
        ));
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='flex w-full align-middle justify-center m-10 mt-20 gap-10'>
                <button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
                    onClick={() => setUrl(data.previous)}
                    disabled={!data?.previous}
                >
                    Anterior
                </button>
                <button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
                    onClick={() => setUrl(data.next)}
                    disabled={!data?.next}
                >
                    Próximo
                </button>
            </div>

            <div className='flex gap-3 w-full'>
                {status === "loading" && <div>Loading...</div>}
                {status === "error" && <div>Error fetching pokemons</div>}
                {status === "success" && (
                    <div className='flex justify-center w-full h-full gap-8 flex-wrap'>
                        {renderPokemonCards(data)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PokemonList;