"use client";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { createPortal } from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
type City = {
  id: number;
  name: string;
  state: string;
  country: string;
  lon: number;
  lat: number;
};

type ICityFromAPI = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

type ISearchBox = {
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  searchedData: City[];
  setSelectedCity: (city: ISelectedCity) => void;
};
type ISelectedCity = {
  lat: number;
  long: number;
};

type IWeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};
const queryClient = new QueryClient();

const LoadingSpinner = () => {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-blue-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
export const SearchBox = ({
  query,
  searchedData,
  setQuery,
  isLoading,
  setSelectedCity,
}: ISearchBox) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  return (
    <div className="relative w-full flex-col flex bg-white text-black rounded border-2 border-black">
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
          className="w-full rounded px-3 py-2 focus:outline-none bg-gray-100/50"
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <div></div>
      </div>
      {showSuggestions && (
        <div className="z-30 absolute mt-14 w-full bg-white border-2 border-black">
          {searchedData.length <= 0 && (
            <div className="w-full px-3 py-1 bg-white">No Data</div>
          )}
          {searchedData.length > 0 && (
            <div className="w-full  flex flex-col rounded bg-white ">
              {searchedData.map((city, index) => (
                <div
                  className="px-3 rounded hover:bg-gray-300 hover:cursor-pointer"
                  key={`${city.id}-${index}`}
                  onClick={() => {
                    setSelectedCity({ lat: city.lat, long: city.lon });
                    setShowSuggestions(false);
                  }}
                >
                  {city.name}, {city.state ? city.state + ", " : ""}
                  {city.country}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Main = (props: ISelectedCity) => {
  const { lat, long } = props;
  // fetching data
  const fetchData = async (lat: number, long: number) => {
    return (
      await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e47a80086b7f65b121c000fdb2e36153`
      )
    ).data as IWeatherData;
  };
  const {
    data: weatherData,
    isLoading: isLoadingWeatherData,
    refetch: refetchWeatherData,
  } = useQuery({
    queryKey: ["weather", lat, long],
    queryFn: () => fetchData(lat, long),
  });
  const myLoader = ({ src }: { src: string }) => {
    if (!weatherData) return "";
    return `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
  };
  if (isLoadingWeatherData) return <div>Loading...</div>;
  return (
    <>
      {weatherData && (
        <div>
          <div>Lattitude: {lat.toFixed(2)}</div>
          <div>Longitude: {long.toFixed(2)}</div>
          <div>
            {weatherData.weather[0].main} - {weatherData.weather[0].description}
          </div>
          <div>{Math.round(weatherData.main.temp - 273)}° C </div>
          <Image
            loader={myLoader}
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            width={50}
            height={50}
            alt=""
          />
        </div>
      )}
    </>
  );
};

export default function Home() {
  const [isPortalDestinationFound, setIsPortalDestinationFound] =
    useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [selectedCity, setSelectedCity] = useState<ISelectedCity | null>(null);
  //fetch data from api
  const [query, setQuery] = useState("");
  const debouncedSearchTerm = useDebounce(query, 300);
  const [data, setData] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async (searchTerm: string) => {
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=e47a80086b7f65b121c000fdb2e36153`
    );
    const resData = (await res.json()).map((item: ICityFromAPI) => {
      const idCity = item.lat + item.lon;
      return { ...item, id: idCity };
    }) as City[];
    setData(resData);
  };

  useEffect(() => {
    if (!debouncedSearchTerm) return;
    setLoading(true);
    handleSearch(debouncedSearchTerm);
    setLoading(false);
  }, [debouncedSearchTerm]);
  useEffect(() => {
    setTimeout(() => {
      const x = document.getElementById("SearchBarPortal") as HTMLDivElement;
      if (x) {
        portalRef.current = x;
        setIsPortalDestinationFound(true);
      }
    }, 1000);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <main className="">
        {isPortalDestinationFound &&
          portalRef &&
          portalRef.current &&
          createPortal(
            <SearchBox
              query={query}
              setQuery={setQuery}
              searchedData={data}
              isLoading={loading}
              setSelectedCity={setSelectedCity}
            />,
            portalRef.current
          )}
        {selectedCity && (
          <Main lat={selectedCity.lat} long={selectedCity.long} />
        )}
      </main>
    </QueryClientProvider>
  );
}
