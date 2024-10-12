import React, { useState } from "react";
import { useQuery } from "react-query";
import Card from './Card';
import { fetchPokemons } from '../Services/pokemonService'; // Importa o serviço
import { Link } from 'react-router-dom';

function PokemonList() {
    const [page, setPage] = useState(0);
    
    const { data, status } = useQuery(
        ["pokemons", page],
        () => fetchPokemons(40, page * 40), // Passa o limite e o offset
        {
            keepPreviousData: true,
        }
    );

    const renderPokemonCards = () => {
        if (!data || !data.results) return <div>Nenhum Pokémon encontrado.</div>;

        return data.results.map((pokemon) => {
            const pokemonName = pokemon.name; // Nome do Pokémon
            return (
                <Link class='flex w-1/6' key={pokemonName} to={`/pokemon/${pokemonName}`}>
                    <Card pokemon={pokemon} />
                </Link>
            );
        });
    };

    return (
        <div className='flex mt-20 w-full flex-col items-center'>
            <div className='flex gap-3 w-full'>
                {status === "loading" && <div>Carregando...</div>}
                {status === "error" && <div className="text-red-500">Erro ao buscar pokémons</div>}
                {status === "success" && (
                    <div className='flex justify-center w-full h-full gap-8 flex-wrap'>
                        {renderPokemonCards()}
                    </div>
                )}
            </div>

            <button
                onClick={() => setPage((prev) => prev + 1)} // Incrementa a página
                className="mt-4 bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-600 transition"
                disabled={status === "loading"} // Desabilita o botão durante o carregamento
            >
                Carregar mais Pokémon
            </button>
        </div>
    );
}

export default PokemonList;
