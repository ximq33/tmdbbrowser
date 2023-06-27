const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_ACCESS_TOKEN}`
    }
};

export const getMoviePage = async (page:number) => {
    try{
        const response = await fetch(process.env.REACT_APP_BASE_API_URL +
            `discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
            options
        );
        return await response.json();
    }
    catch (error) {
        console.log(error)
    }

}

export const getGenreList = async () => {
    try {
        const response = await fetch(process.env.REACT_APP_BASE_API_URL + 'genre/movie/list?language=en', options)
        const {genres} = await response.json();
        return genres;
    }
    catch (error) {
        console.log(error)
    }
}

export const searchByTerm = async (term, page) => {
    try{
        const response = await fetch(
            process.env.REACT_APP_BASE_API_URL +
            `search/movie?query=${term}&include_adult=false&language=en-US&page=${page}`,
            options
        )

        return await response.json();
    }
    catch (error) {
        console.log(error)
    }
}


