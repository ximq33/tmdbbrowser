import {apiPageLimit, apiPageSize} from "../../Utils/Constants";

export const initialState = {
    loading: false,
    currentPage: 1,
    pageSize: 7,
    totalPages: 0,
    genreList: [],
    totalResults: 0,
    totalApiResults: 0,
    refreshTable: 0,
    searchTerm: "",
    currentPageData: [],
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            }
        case 'SET_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.payload
            }
        case 'SET_TOTAL_RESULTS':
            return {
                ...state,
                totalResults: action.payload["total_results"] / apiPageSize > apiPageLimit ? apiPageLimit * apiPageSize : action.payload["total_results"],
                totalApiResults: action.payload["total_results"],
            };
        case 'SET_TOTAL_PAGES':
            return {
                ...state,
                totalPages: Math.ceil( state.totalResults / state.pageSize),
            }
        case 'SET_GENRE_LIST':
            return {
                ...state,
                genreList: action.payload,
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload,
            };
        case 'SET_REFRESH_TABLE':
            return {
                ...state,
                refreshTable: state.refreshTable + 1,
            };
        case 'SET_CURRENT_PAGE_DATA':
            return {
                ...state,
                currentPageData: action.payload,
            }
        case 'SET_PAGE_SIZE':
            return {
                ...state,
                pageSize: action.payload,
            }
        default:
            return state;
    }
};
