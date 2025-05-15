import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

const useSearchData = (delay = 300) => {
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );
  const [inputValue, setInputValue] = useState(searchQuery);

  const debouncedSetSearchQuery = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      localStorage.setItem("searchQuery", query);
    }, delay),
    [delay]
  );

  const handleInputChange = (query) => {
    setInputValue(query);
    debouncedSetSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  return { inputValue, handleInputChange };
};

export default useSearchData;
