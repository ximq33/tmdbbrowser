import React, {useEffect, useReducer} from 'react';
import BootstrapTable from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getGenreList, getMoviePage, searchByTerm} from "../../Utils/ApiCalls";
import './MovieTable.css'
import {Container} from "react-bootstrap";
import {initialState, reducer} from "./MovieTableReducer";
import {CustomPagination} from "../Pagination/CustomPagination";
import {apiPageLimit, apiPageSize} from "../../Utils/Constants";
import {SearchBar} from "../SearchBar/SearchBar";

const MovieTable = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        loading,
        currentPage,
        pageSize,
        totalPages,
        genreList,
        totalApiResults,
        currentPageData,
        refreshTable,
        searchTerm,
    } = state;


    useEffect(() => {
        dispatch({type: "SET_LOADING", payload: true})
        getMoviePage(1)
            .then(result => {
                dispatch({type: "SET_SEARCH_TERM", payload: ""})
                dispatch({type: "SET_TOTAL_RESULTS", payload: result})
                dispatch({type: "SET_TOTAL_PAGES"})
                dispatch({
                    type: 'SET_CURRENT_PAGE_DATA', payload: result.results && result.results.length > 0 ?
                        result.results.slice(0, pageSize) : []
                })
                dispatch({type: "SET_CURRENT_PAGE", payload: 1})
            })
            .then(() =>
                getGenreList()
                    .then(result => {
                        dispatch({type: 'SET_GENRE_LIST', payload: result});
                        dispatch({type: "SET_LOADING", payload: false})
                    })
            );

    }, [refreshTable]);

    const handlePageChange = async (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        dispatch({type: "SET_LOADING", payload: true})
        dispatch({type: 'SET_CURRENT_PAGE', payload: page});

        const apiPageCount = Math.ceil(page * pageSize / apiPageSize) > apiPageLimit ?
            apiPageLimit : Math.ceil(page * pageSize / apiPageSize);
        const startIndex = (page - 1) * pageSize - (apiPageCount - 1) * apiPageSize;
        const endIndex = page * pageSize - (apiPageCount - 1) * apiPageSize;

        if (searchTerm === "") {
            const result = await getMoviePage(apiPageCount)
            if (startIndex < 0) {
                const dataEnd = result.results.slice(0, endIndex)
                const previousPageResult = await getMoviePage(apiPageCount - 1)
                const dataStart = previousPageResult.results.slice(apiPageSize + startIndex, apiPageSize)
                const pageData = dataStart.concat(dataEnd)
                dispatch({type: 'SET_CURRENT_PAGE_DATA', payload: pageData})
                dispatch({type: "SET_LOADING", payload: false})
                return;
            }

            const pageData = result.results.slice(startIndex, endIndex)
            dispatch({type: 'SET_CURRENT_PAGE_DATA', payload: pageData})
            dispatch({type: "SET_LOADING", payload: false})
        } else {
            const result = await searchByTerm(searchTerm, apiPageCount)
            dispatch({type: "SET_TOTAL_RESULTS", payload: result})
            dispatch({type: "SET_TOTAL_PAGES"})
            if (startIndex < 0) {
                const dataEnd = result.results.slice(0, endIndex)
                const previousPageResult = await searchByTerm(searchTerm, apiPageCount - 1)
                const dataStart = previousPageResult.results.slice(apiPageSize + startIndex, apiPageSize)
                const pageData = dataStart.concat(dataEnd)
                dispatch({type: 'SET_CURRENT_PAGE_DATA', payload: pageData})
                dispatch({type: "SET_LOADING", payload: false})
                return;
            }

            const pageData = result.results.slice(startIndex, endIndex)
            dispatch({type: 'SET_CURRENT_PAGE_DATA', payload: pageData})
            dispatch({type: "SET_LOADING", payload: false})

        }

    };


    const handlePageSizeChange = (size) => {
        if (!(size > 7) && !(size < 1)) {
            dispatch({type: 'SET_PAGE_SIZE', payload: size})
            dispatch({type: 'SET_REFRESH_TABLE'})
        }
    }

    const handleSearch = async (term) => {
        dispatch({type: "SET_LOADING", payload: true})
        dispatch({type: 'SET_SEARCH_TERM', payload: term})

        if (term === "") {
            dispatch({type: 'SET_REFRESH_TABLE'});
            return;
        }

        const result = await searchByTerm(term, 1);
        dispatch({type: "SET_TOTAL_RESULTS", payload: result})
        dispatch({type: "SET_TOTAL_PAGES"})
        dispatch({
            type: 'SET_CURRENT_PAGE_DATA', payload: result.results && result.results.length > 0 ?
                result.results.slice(0, currentPage * pageSize) : []
        })
        dispatch({type: 'SET_CURRENT_PAGE', payload: 1});
        dispatch({type: "SET_LOADING", payload: false})

    };

    return (
        <Container>
            <SearchBar
                onSearch={(term) => handleSearch(term)}
                totalResults={totalApiResults}
                loading={loading}
            />


            {currentPageData && currentPageData.length > 0 ? (
                <div className={`table-wrapper ${loading ? "loading" : ""}`}>
                    <div className={`loading-overlay ${loading ? "show" : ""}`}/>
                    <BootstrapTable hover>
                        <tbody>
                        {currentPageData &&
                            currentPageData.map(
                                (
                                    {
                                        original_title,
                                        overview,
                                        poster_path,
                                        release_date,
                                        genre_ids,
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td className="image-column">
                                            <img
                                                alt=""
                                                className="poster"
                                                src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                                                loading="lazy"
                                            />
                                        </td>
                                        <td className="text-start ">
                                            <div className="fs-5">
                                                <span>{index + 1 + currentPage * pageSize - pageSize}. &nbsp;</span>
                                                <strong>{original_title}</strong>
                                            </div>
                                            <div>
                                                <span className="release-date">{release_date}</span>
                                            </div>
                                            <div className="mt-2">
                                                {genre_ids &&
                                                    genre_ids.map((genreId) => {
                                                        const genre = genreList.find(
                                                            (item) => item.id === genreId
                                                        );
                                                        return (
                                                            <span key={genreId}
                                                                  className="genre-badge px-2">{genre && genre.name}</span>
                                                        );
                                                    })}
                                            </div>
                                            <div className="mt-3">{overview}</div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </BootstrapTable>
                </div>
            ) : (<div className="my-3">Nothing found...</div>)}


            <CustomPagination
                onPageChange={(page) => handlePageChange(page)}
                onPageSizeChange={(size) => handlePageSizeChange(size)}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
            />
        </Container>
    );
};

export default MovieTable;
