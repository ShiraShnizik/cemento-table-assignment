// Props received by the PaginationControls component
interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;

    // Moves to the previous page
    onPreviousPage: () => void;

    // Moves to the next page
    onNextPage: () => void;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage
}: PaginationControlsProps) {

    return (
        <div className="pagination-controls">

            <button

                // Trigger previous page navigation
                onClick={onPreviousPage}

                // Disable button on the first page
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Display current pagination status */}
            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button

                // Trigger next page navigation
                onClick={onNextPage}

                // Disable button on the last page
                disabled={currentPage === totalPages}
            >
                Next
            </button>

        </div>
    );
}