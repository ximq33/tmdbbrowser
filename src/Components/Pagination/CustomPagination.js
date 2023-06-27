import Pagination from "react-bootstrap/Pagination";
import './CustomPagination.css';
import {Dropdown} from "react-bootstrap";


type CustomPaginationProps = {
    onPageChange: number => void,
    currentPage: number,
    totalPages: number,
    onPageSizeChange: number => void,
    pageSize: number,
}

export const CustomPagination = (props: CustomPaginationProps) => {

    const paginationItems = [];
    const maxVisiblePages = 7;

    paginationItems.push(
        <Pagination.First
            key="first"
            onClick={() => props.onPageChange(1)}
            disabled={props.currentPage === 1}
            className={props.currentPage === 1 ? 'invisible' : ''}
        />
    );

    paginationItems.push(
        <Pagination.Prev
            key="prev"
            onClick={() => props.onPageChange(props.currentPage - 1)}
            disabled={props.currentPage === 1}
            className={props.currentPage === 1 ? "invisible" : ""}
        />
    );

    if (props.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= props.totalPages; i++) {
            paginationItems.push(
                <Pagination.Item
                    key={i}
                    active={i === props.currentPage}
                    onClick={() => props.onPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
    } else {
        const visiblePages = Math.min(props.totalPages, maxVisiblePages - 2);
        let startPage = props.currentPage - Math.floor(visiblePages / 2);

        if (startPage < 1) {
            startPage = 1;
        } else if (startPage + visiblePages > props.totalPages) {
            startPage = props.totalPages - visiblePages + 1;
        }

        for (let i = startPage; i < startPage + visiblePages; i++) {
            paginationItems.push(
                <Pagination.Item
                    key={i}
                    active={i === parseInt(props.currentPage)}
                    onClick={() => props.onPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
    }

    paginationItems.push(
        <Pagination.Next
            key="next"
            onClick={() => {
                let page = props.currentPage
                props.onPageChange(++page)
            }}
            disabled={props.currentPage === props.totalPages}
            className={parseInt(props.currentPage) === props.totalPages || props.totalPages === 0 ? 'invisible' : ''}
        />
    );

    paginationItems.push(
        <Pagination.Last
            key="last"
            onClick={() => props.onPageChange(props.totalPages)}
            disabled={props.currentPage === props.totalPages}
            className={parseInt(props.currentPage) === props.totalPages || props.totalPages === 0 ? 'invisible' : ''}
        />
    );

    const numbers = [1, 2, 3, 4, 5, 6, 7];


    return (
        <div
            className="pagination-container d-flex align-items-center mt-3 mb-4">
            <Dropdown>
                <Dropdown.Toggle className="dropdown" id="number-dropdown">
                    {props.pageSize}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {numbers.map((number) => (
                        <Dropdown.Item key={number} onClick={() => props.onPageSizeChange(number)}>{number}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <Pagination className="pagination-rounded">
                {paginationItems}
            </Pagination>

            <form className="form-inline  goto" onSubmit={(e) => {
                e.preventDefault()
                const currentValue = e.target["goto"].value
                if (currentValue > props.totalPages) {
                    props.onPageChange(props.totalPages)
                }
                else
                    props.onPageChange(currentValue)
            }}>
                <div className="form-group mx-2 d-flex">
                    <input
                        id="goto"
                        type="number"
                        className="form-control goto-input"
                        min="1"
                        pattern="[0-9]"
                        max={props.totalPages}
                        step="1"
                        placeholder={props.currentPage}
                    />
                    <span className="m-2"> /&nbsp; {props.totalPages}</span>

                </div>
            </form>
        </div>
    )

};

