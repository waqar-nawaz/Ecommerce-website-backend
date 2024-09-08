


const pagination = ({ currentPage = 1, perPage = 10, totalItems = 0 }) => {
    try {
        if (currentPage < 1) currentPage = 1;
        if (perPage < 1) perPage = 10;
        if (totalItems < 0) totalItems = 0;

        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (currentPage - 1) * perPage;

        // Handle case when currentPage is greater than totalPages
        if (currentPage > totalPages) {
            throw new Error("Page not found");
        }

        return {
            currentPage,
            skip,
            perPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        };
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = pagination;
