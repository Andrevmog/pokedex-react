import React from 'react';


const Card = ({name}) => {


    return (
        <a href="#" class="flex flex-col p-6 w-1/4 h-30 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">Pokemon</p>
        </a>
    )
}

export default Card;