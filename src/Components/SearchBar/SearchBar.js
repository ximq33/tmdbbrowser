import React from "react";
import './SearchBar.css';

type SearchBarProps = {
    onSearch: String => void,
    totalResults: number,
    loading: boolean
}

export const SearchBar = (props:SearchBarProps) => {


    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder={`Search through ${props.totalResults} movies... `}
                className="searchbar"
                onChange={event => props.onSearch(event.target.value)}
            />
            {props.loading ? <div className="loading-spinner"/> : <div className="loading-spinner invisible"/>}
        </div>
    )
}
