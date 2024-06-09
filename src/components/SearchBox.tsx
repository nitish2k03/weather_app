import React, { useState } from "react";
import { TiPinOutline } from "react-icons/ti";

import { LoadingSpinner } from "./LoadingSpinner";
const SearchBox = ({
  query,
  searchedData,
  setQuery,
  isLoading,
  handlePinThisCity,
}: ISearchBox) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative w-full flex-col flex bg-white text-black dark:border-darkBorder dark:bg-gray-700 dark:text-white rounded border-2 border-black">
      <div className="flex justify-start items-center ">
        <div className="flex justify-center items-center w-[50px] ">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          )}
        </div>
        <input
          onFocus={() => setShowSuggestions(true)}
          className="w-full rounded px-3 py-2 focus:outline-none bg-gray-100/50 dark:bg-gray-700 "
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 1000)}
        ></input>
        <div></div>
      </div>
      {showSuggestions && (
        <div className="z-30 absolute mt-14 w-full bg-white border-2 border-black">
          {searchedData.length <= 0 && (
            <div className="w-full px-3 py-1 bg-white">No Data</div>
          )}
          {searchedData.length > 0 && (
            <div className="w-full  flex flex-col rounded bg-white dark:bg-gray-700 ">
              {searchedData.map((city, index) => (
                <div
                  className="px-3 rounded hover:bg-blue-300 hover:cursor-pointer group flex justify-between"
                  key={`${city.id}-${index}`}
                  onClick={() => {
                    handlePinThisCity(city);
                    setShowSuggestions(false);
                  }}
                >
                  {city.name}, {city.state ? city.state + ", " : ""}
                  {city.country}
                  <div className="hidden group-hover:flex justify-center items-center">
                    <TiPinOutline />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchBox;
