"use client";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { BsCloudSun, BsSunrise, BsSunset } from "react-icons/bs";
// import { TbWorldLatitude, TbWorldLongitude } from "react-icons/tb";
import { CiGlobe } from "react-icons/ci";
import {
  FaCloudRain,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaRegCircle,
  FaThermometerHalf,
} from "react-icons/fa";
import { WiDegrees, WiFog, WiHumidity } from "react-icons/wi";
import { createPortal } from "react-dom";
import { Rubik } from "next/font/google";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
type ISideBarProps = {
  selectedCity: ISelectedCity | null;
  query: string;
  setQuery: (query: string) => void;
  data: City[];
  loading: boolean;
  setSelectedCity: (city: ISelectedCity) => void;
};
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
const RubikFont = Rubik({
  subsets: ["latin"],
});

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

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      Date : {date.toLocaleDateString()}
      <br />
      Time : {time.toLocaleTimeString()}
    </div>
  );
};

type IWeatherCard = {
  lon: number;
  lat: number;
  descHeading: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  windSpeed: number;
  id: number;
  name: string;
};

const WeatherCard = () =>
  //   {
  //   lon,
  //   lat,
  //   descHeading,
  //   description,
  //   icon,
  //   temp,
  //   feels_like,
  //   temp_min,
  //   temp_max,
  //   humidity,
  //   windSpeed,
  //   id,
  //   name,
  // }: IWeatherCard
  {
    return (
      <div
        className={` w-full min-h-[400px] rounded-md flex border-2 border-black ${RubikFont.className}`}
      >
        <div className=" h-full w-1/3 flex flex-col border-r-2 border-black shadow-lg">
          <div className="h-2/3  w-full flex flex-col text-white">
            <div className="w-full h-3/4 flex bg-indigo-600">
              <div className=" w-3/4 h-full flex justify-start items-center">
                <div className=" h-full w-[70%] text-9xl pl-6 font-extrabold flex justify-center items-center">
                  30
                </div>
                <div className=" flex-col w-1/4 text-6xl font-semibold flex justify-center space-y-4">
                  <div className="cflex">
                    <FaRegCircle className="size-5 font-bold" />
                  </div>
                  <div className="cflex">C</div>
                  {/* <div className="flex justify-center items-start leading-0">
                    
                  </div>
                  <div className="flex justify-end items-center">C</div> */}
                </div>
              </div>
              <div className="w-[30%] h-full flex-col flex justify-center text-2xl">
                <div className="flex justify-start items-center w-full">
                  <FaLongArrowAltUp className="text-red-500" />
                  20° C
                </div>
                <div className="flex justify-start items-center mt-6 w-full">
                  <FaLongArrowAltDown className="text-green-500" /> 40° C
                </div>
              </div>
            </div>
            <div className="text-3xl h-1/4 flex items-center font-light px-3 bg-blue-600">
              <FaThermometerHalf />
              Feels like 40°C
            </div>
          </div>
          <div className="w-full  h-1/3 cflex flex-col bg-blue-400">
            <div className="text-4xl w-full flex px-4 font-semibold">Clear</div>
            <div className="text-2xl w-full flex px-4">
              Clear with sunny sky
            </div>
          </div>
        </div>
        <div className=" h-full w-2/3 flex flex-col">
          <div className="w-full  h-1/3 p-4 bg-black text-white flex justify-between items-center">
            <span className="flex justify-start items-center font-semibold text-4xl w-full ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-14 mr-3 -mt-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span>Chandigarh, India</span>
            </span>
            <span className=" h-full flex justify-end items-center w-40">
              {/* {Latitude & Longiture} */}
              <CiGlobe className="size-8 mr-2" />
              <div className="flex flex-col ">
                <span>30.7333 °</span>
                <span>76.7794 '</span>
              </div>
            </span>
          </div>
          <div className="w-full grid grid-cols-2  h-2/3 text-2xl text-gray-800">
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <BsSunrise className={"size-8"} />
              </span>
              {/* <span className="heading">Sunrise</span> */}
              <span className="value">hello</span>
            </div>
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <BsSunset className={"size-8"} />
              </span>
              {/* <span className="heading">Sunset</span> */}
              <span className="value">hello</span>
            </div>
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <FaCloudRain className={"size-8"} />
              </span>
              {/* <span className="heading">Rain %</span> */}
              <span className="value">hello</span>
            </div>
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <BsCloudSun className={"size-8"} />
              </span>
              {/* <span className="heading">Clouds</span> */}
              <span className="value">hello</span>
            </div>
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <WiFog className={"size-8"} />
              </span>
              {/* <span className="heading">Visibility</span> */}
              <span className="value">hello</span>
            </div>
            <div className=" h-full cflex px-4 !justify-start">
              <span className="icon mr-3">
                <WiHumidity className={"size-10"} />
              </span>
              {/* <span className="heading">Humidity</span> */}
              <span className="value">hello</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

const SideBar = ({
  query,
  setQuery,
  setSelectedCity,
  loading,
  data,
  selectedCity,
}: ISideBarProps) => {
  return (
    <div className="border-r-2 border-black w-[300px]">
      <div className="border-b-2 border-black p-4">
        <SearchBox
          query={query}
          setQuery={setQuery}
          searchedData={data}
          isLoading={loading}
          setSelectedCity={setSelectedCity}
        />
        {selectedCity ? <div>{selectedCity.lat}</div> : <div>no data</div>}
      </div>
      <div className="h-[78%]">Pinned Locations</div>
      <div className="border-t-2 border-black px-2">
        <RealTimeClock />
      </div>
    </div>
  );
};

export default function Home() {
  useState(false);
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
  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-screen w-screen flex">
        {/* {selectedCity && (
          <Main lat={selectedCity.lat} long={selectedCity.long} />
        )} */}

        <SideBar
          query={query}
          setQuery={setQuery}
          setSelectedCity={setSelectedCity}
          selectedCity={selectedCity}
          loading={loading}
          data={data}
        />
        <div className="flex flex-col w-full px-[50px] space-y-5 h-full overflow-y-auto">
          <div className="h-5 w-ful"></div>
          <WeatherCard />
          <WeatherCard />
          <WeatherCard />
          <WeatherCard />
        </div>
      </main>
    </QueryClientProvider>
  );
}
