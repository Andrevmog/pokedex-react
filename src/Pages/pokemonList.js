import React, { useState } from "react";
import { useQuery } from "react-query";
import Card from '../Components/Card';
import { fetchPokemons } from '../Services/pokemonService'; // Importa o serviço

function PokemonList() {
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/?limit=20");
    const { data, status } = useQuery(["pokemons", url], () => fetchPokemons(url)); // Usa a função do serviço

    const renderPokemonCards = (pokemons) => {
        if (!pokemons || !pokemons.results) {
            return null;
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
                <button 
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${url === "https://pokeapi.co/api/v2/pokemon/?limit=20" ? 'disabled:bg-slate-500' : ''}`}
                    onClick={() => setUrl("https://pokeapi.co/api/v2/pokemon/?limit=20")}
                    disabled={url === "https://pokeapi.co/api/v2/pokemon/?limit=20"}
                >
                    Início
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