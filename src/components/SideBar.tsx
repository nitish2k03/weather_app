import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";

const isCittySame = (city1: ICityFromAPI, city2: ICityFromAPI) => {
  return city1.lat === city2.lat && city1.lon === city2.lon;
};

export const isCityInArray = (city: ICityFromAPI, cities: ICityFromAPI[]) => {
  return cities.some((item) => isCittySame(item, city));
};
const RealTimeClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setDate(new Date().toLocaleDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      Date : {date}
      <br />
      {/* Time : {time} */}
    </div>
  );
};

export const SideBar = ({
  query,
  setQuery,
  setSelectedCity,
  loading,
  data,
  selectedCity,
  savedCityCoordinates,
  visibleCities,
  setSavedCityCoordinates,
  setVisibleCities,
}: ISideBarProps) => {
  const handlePinThisCity = (city: City) => {
    // add this city to list of saved cities
    setSavedCityCoordinates([...savedCityCoordinates, city]);
    setVisibleCities([...visibleCities, city]);
  };

  return (
    <div className="border-r-2 border-black w-[300px]">
      <div className="border-b-2 border-black p-4">
        <SearchBox
          query={query}
          setQuery={setQuery}
          searchedData={data}
          isLoading={loading}
          handlePinThisCity={handlePinThisCity}
        />
      </div>
      <div className="h-[78%] flex-col flex px-3 pt-3">
        <div className="font-bold border-b-2 border-gray-500 pb-2">
          Pinned Locations
        </div>
        <div className="flex flex-col text-black">
          {savedCityCoordinates.map((city, index) => (
            <div
              key={`${city.lat}-${index}`}
              className="flex justify-between items-center bg-gray-300 mt-1 p-2 rounded"
            >
              <div>{city.name}</div>
              <div className="flex text-xs">
                <button
                  onClick={() => {
                    // if city is already visible then remove it
                    if (isCityInArray(city, visibleCities)) {
                      setVisibleCities(
                        visibleCities.filter((item) => item !== city)
                      );
                    } else {
                      setVisibleCities([...visibleCities, city]);
                    }
                  }}
                  className="bg-green-500 rounded text-xs px-2 py-1"
                >
                  {/* SHow Hide Icon */}
                  {isCityInArray(city, visibleCities) ? "Hide" : "Show"}
                </button>
                <button
                  className="bg-red-500 rounded text-xs px-2 py-1 ml-2"
                  onClick={() => {
                    setSavedCityCoordinates(
                      savedCityCoordinates.filter((item) => item !== city)
                    );
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-black px-2">
        <RealTimeClock />
      </div>
    </div>
  );
};