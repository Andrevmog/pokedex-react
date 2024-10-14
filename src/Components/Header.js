import React from 'react';

const Header = () => {
    return (
        <header className="bg-red-600 p-4 text-white shadow-md fixed w-full flex justify-between top-0 left-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-3xl font-bold">Pokedéx</a>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/" className="hover:underline">Home</a>
                        </li>
                        <li>
                            <a href="/list" className="hover:underline">Pokemon List</a>
                        </li>
                        <li>
                            <a href="/" className="hover:underline">Contato</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;