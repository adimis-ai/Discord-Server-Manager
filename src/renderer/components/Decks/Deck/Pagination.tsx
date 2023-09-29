// /home/adimis/Desktop/Simplifi/simplifids/src/renderer/components/Decks/Deck/Pagination.tsx
import React, { useState } from 'react';
import './Pagination.css';

interface PaginationProps {
    id: string;
    offset: number;
    setOffset: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ id, offset, setOffset }) => {
    const totalPages = 25 
    const pageLimit = 25
    const visiblePages = 5

    const [currentPage, setCurrentPage] = useState(1);

    const handleClick = (page) => {
        setCurrentPage(page);
        setOffset((page - 1) * pageLimit);
    }

    const renderPageNumbers = () => {
        let pageNumbers = [];
        let leftSide = currentPage - Math.floor(visiblePages / 2);
        let rightSide = currentPage + Math.floor(visiblePages / 2);

        if (leftSide < 1) {
            rightSide += 1 - leftSide;
            leftSide = 1;
        }
        if (rightSide > totalPages) {
            leftSide -= rightSide - totalPages;
            rightSide = totalPages;
        }

        let leftDotShown = false;
        let rightDotShown = false;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= leftSide && i <= rightSide)) {
                pageNumbers.push(
                    <li key={i} className={currentPage === i ? 'active' : ''} onClick={() => handleClick(i)}>{i}</li>
                );
            } else if (i === leftSide - 1 || i === rightSide + 1) {
                if (i > 2 && i < totalPages - 1) {
                    if (i === leftSide - 1 && !leftDotShown) {
                        pageNumbers.push(
                            <li key={i} className="dot">...</li>
                        );
                        leftDotShown = true;
                    } else if (i === rightSide + 1 && !rightDotShown) {
                        pageNumbers.push(
                            <li key={i} className="dot">...</li>
                        );
                        rightDotShown = true;
                    }
                }
            }
        }

        return pageNumbers;
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                {renderPageNumbers()}
            </ul>
        </div>
    );
}

export default Pagination;