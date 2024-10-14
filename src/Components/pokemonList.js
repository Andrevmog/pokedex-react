import React, { useEffect, useRef, useState, useMemo } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { Link } from 'react-router-dom';
import Card from './Card';
import { fetchPokemons } from '../Services/pokemonService';

const PokemonList = () => {
    const loadMoreRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const queryClient = useQueryClient();

    // Query para buscar todos os Pokémons
    const { data: allPokemons } = useQuery(
        "allPokemons",
        () => fetchPokemons(1302, 0), // Busca todos os Pokémon
        { staleTime: 600000 }
    );

    // Infinite query para carregar os Pokémons
    const {
        data,
        status,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery(
        `pokemons_search_${debouncedSearchTerm}`,
        ({ pageParam = 0 }) => fetchPokemons(40, pageParam),
        {
            getNextPageParam: (lastPage) => lastPage.next ? lastPage.offset : undefined,
            enabled: !!debouncedSearchTerm // Habilita a query apenas se o termo estiver presente
        }
    );

    // Efeito para configurar a rolagem infinita
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        }, {
            rootMargin: '300px',
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreRef, hasNextPage, fetchNextPage]);

    // Efeito de debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Resetar a consulta quando o input está vazio
    useEffect(() => {
        if (!searchTerm) {
            queryClient.removeQueries(`pokemons_search_${debouncedSearchTerm}`); // Remove as queries relacionadas ao termo de busca
            queryClient.setQueryData(`pokemons_search_${debouncedSearchTerm}`, undefined); // Limpa os dados da query
            refetch(); // Refaz a busca para carregar os Pokémon padrão
        }
    }, [searchTerm, queryClient, refetch, debouncedSearchTerm]);

    // UseMemo para otimizar a filtragem
    const filteredPokemons = useMemo(() => {
        if (debouncedSearchTerm) {
            return allPokemons?.results.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            ) || [];
        }
        return data?.pages.flatMap(page => page.results) || [];
    }, [debouncedSearchTerm, allPokemons, data]);

    const renderPokemonCards = () => {
        if (!filteredPokemons || filteredPokemons.length === 0) return <div>Nenhum Pokémon encontrado.</div>;

        return filteredPokemons.map((pokemon) => (
            <Link className='flex w-1/6 min-w-80' key={pokemon.name} to={`/pokemon/${pokemon.name}`}>
                <Card pokemon={pokemon} />
            </Link>
        ));
    };

    return (
        <div className='flex mt-20 w-full flex-col items-center relative'>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar Pokémon..."
                className="border border-gray-300 p-2 w-full max-w-md rounded mb-4"
            />

            <div className='flex gap-3 w-full'>
                {status === "loading" && <div>Carregando...</div>}
                {status === "error" && <div className="text-red-500">Erro ao buscar pokémons</div>}
                {status === "success" && (
                    <div className='flex justify-center w-full h-full gap-8 flex-wrap'>
                        {renderPokemonCards()}
                    </div>
                )}
            </div>

            <div ref={loadMoreRef} className="h-10" />

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg hover:bg-green-600 transition"
            >
                Voltar ao Topo
            </button>
        </div>
    );
};

export default PokemonList;
