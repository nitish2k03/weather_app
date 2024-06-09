"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import SearchBox from "@/components/SearchBox";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { config } from "@/lib/utils";
import { WeatherCardWrapper } from "@/components/WeatherCard";

const queryClient = new QueryClient();

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

const isCittySame = (city1: ICityFromAPI, city2: ICityFromAPI) => {
  return city1.lat === city2.lat && city1.lon === city2.lon;
};

const isCityInArray = (city: ICityFromAPI, cities: ICityFromAPI[]) => {
  return cities.some((item) => isCittySame(item, city));
};

const SideBar = ({
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
        {/* {selectedC  ity ? <div>{selectedCity.lat}</div> : <div>no data</div>} */}
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
              {/* <div>{city.lat}</div>
              <div>{city.lon}</div> */}
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

function Main() {
  useState(false);
  const [currentSearchedCity, setCurrentSearchedCity] =
    useState<ISelectedCity | null>(null);
  //fetch data from api
  const [query, setQuery] = useState("");
  const debouncedSearchTerm = useDebounce(query, 300);
  const [data, setData] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (searchTerm: string) => {
    const res = (
      await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=e47a80086b7f65b121c000fdb2e36153`,
        config
      )
    ).data as ICityFromAPI[];
    const resData = res.map((item: ICityFromAPI) => {
      const idCity = item.lat + item.lon;
      return { ...item, id: idCity };
    }) as City[];
    setData(resData);
  };

  // const [selectedCity,setSelectedCity] = useState<ISelectedCity | null>(null)
  const [currentCity, setCurrentCity] = useState<ICityFromAPI | null>(null);
  const [visibleCities, setVisibleCities] = useState<ICityFromAPI[]>([]);
  const [savedCityCoordinates, setSavedCityCoordinates] = useState<
    ICityFromAPI[]
  >([
    // {
    //   name: "Delhi",
    //   lat: 28.6667,
    //   lon: 77.2167,
    //   country: "IN",
    //   state: "DL",
    // },
    // {
    //   name: "Mumbai",
    //   lat: 19.0144,
    //   lon: 72.8479,
    //   country: "IN",
    //   state: "MH",
    // },
    // {
    //   name: "Bangalore",
    //   lat: 12.9762,
    //   lon: 77.6033,
    //   country: "IN",
    //   state: "KA",
    // },
    // {
    //   name: "Kolkata",
    //   lat: 22.5411,
    //   lon: 88.3378,
    //   country: "IN",
    //   state: "WB",
    // },
  ]);

  useEffect(() => {
    // console.log("visibleCities", visibleCities);
    // if city not in saved city it should be removed from visible cities as well
    setVisibleCities(
      visibleCities.filter((city) => isCityInArray(city, savedCityCoordinates))
    );
    // if()
  }, [savedCityCoordinates]);

  // const [wData, setWData] = useState<IWeatherData | null>(null);
  // useEffect(() => {
  //   if (selectedCity) setWData(fetchData(selectedCity.lat, selectedCity.long));
  // }, [selectedCity]);
  // const fetchWeatherDataBasedOnLatLon = async (lat: number, long: number) => {
  //   return (
  //     await axios.get(
  //       `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e47a80086b7f65b121c000fdb2e36153`
  //     )
  //   ).data as IWeatherData;
  // };

  // const { data: weatherData, isLoading: isLoadingWeatherData } = useQuery({
  //   queryKey: ["weather", data],
  //   queryFn: () => fetchWeatherDataBasedOnLatLon(data[0].lat, data[0].lon),
  // });

  useEffect(() => {
    if (!debouncedSearchTerm) return;
    setLoading(true);
    handleSearch(debouncedSearchTerm);
    setLoading(false);
  }, [debouncedSearchTerm]);
  return (
    <main className="h-screen w-screen flex">
      <SideBar
        query={query}
        setQuery={setQuery}
        setSelectedCity={setCurrentSearchedCity}
        selectedCity={currentSearchedCity}
        loading={loading}
        data={data}
        savedCityCoordinates={savedCityCoordinates}
        visibleCities={visibleCities}
        setSavedCityCoordinates={setSavedCityCoordinates}
        setVisibleCities={setVisibleCities}
      />

      <div className="flex flex-col w-full px-[50px] space-y-5 h-full overflow-y-auto">
        <div className="h-5 w-ful"></div>
        {/* {data.length > 0 && (
          <WeatherCardWrapper lat={data[0].lat} lon={data[0].lon} />
          )} */}
        {visibleCities.map((city, index) => (
          <WeatherCardWrapper
            key={`${city.lat}-${index}`}
            lat={city.lat}
            lon={city.lon}
            cityName={city.name}
          />
        ))}
        {/* <div>
          Saved City With Coordinates:
          {savedCityCoordinates.map((city, index) => (
            <div key={`${city.lat}-${index}`}>
            {city.name}, {city.lat}, {city.lon}
            </div>
            ))}
            </div>
            <div>
            Visible City With Coordinates:
            {visibleCities.map((city, index) => (
              <div key={`${city.lat}-${index}`}>
              {city.name}, {city.lat}, {city.lon}
              </div>
              ))}
              </div> */}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}
