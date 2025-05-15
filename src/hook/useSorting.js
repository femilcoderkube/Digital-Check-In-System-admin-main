import React, { useState } from 'react'

const useSorting = (data) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    const sortedData = () => {
        let sortedData = [...data];
        if (sortConfig.key !== null) {
            sortedData.sort((a, b) => {
                const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
                const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";


                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedData;
    };
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === "ascending" ? <i className="bi bi-arrow-up-short"></i> : <i className="bi bi-arrow-down-short"></i>;
        }
        return <i className="bi bi-arrow-down-up arrow-op"></i>
    };

    return {
        requestSort, renderSortIcon, sortedData
    }
}

export default useSorting