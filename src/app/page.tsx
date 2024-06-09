"use client";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { BsCloudSun, BsSunrise, BsSunset } from "react-icons/bs";
import { TiPinOutline } from "react-icons/ti";
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
  savedCityCoordinates: ICityFromAPI[];
  visibleCities: ICityFromAPI[];
  selectedCity: ISelectedCity | null;
  query: string;
  setQuery: (query: string) => void;
  data: City[];
  loading: boolean;
  setSelectedCity: (city: ISelectedCity) => void;
  setSavedCityCoordinates: (city: ICityFromAPI[]) => void;
  setVisibleCities: (city: ICityFromAPI[]) => void;
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
  handlePinThisCity: (city: City) => void;
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
const SearchBox = ({
  query,
  searchedData,
  setQuery,
  isLoading,
  handlePinThisCity,
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

type IWeatherCard = {
  coutryCode: string;
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
  sunrise: number;
  sunset: number;
  visibility: number;
  clouds: number;
};

const WeatherCard = ({
  lon,
  lat,
  descHeading,
  description,
  icon,
  temp,
  feels_like,
  temp_min,
  temp_max,
  humidity,
  windSpeed,
  id,
  name,
  sunrise,
  sunset,
  visibility,
  clouds,
  coutryCode,
}: IWeatherCard) => {
  return (
    <div
      className={` w-full min-h-[400px] rounded-md flex border-2 border-black ${RubikFont.className}`}
    >
      <div className=" h-full w-1/3 flex flex-col border-r-2 border-black shadow-lg">
        <div className="h-2/3  w-full flex flex-col text-white">
          <div className="w-full h-3/4 flex bg-indigo-600">
            <div className=" w-3/4 h-full flex justify-start items-center">
              <div className=" h-full w-[70%] text-9xl pl-6 font-extrabold flex justify-center items-center">
                {temp}
              </div>
              <div className=" flex-col w-1/4 text-6xl font-semibold flex justify-center space-y-4">
                <div className="cflex">
                  <FaRegCircle className="size-5 font-bold" />
                </div>
                <div className="cflex">C</div>
              </div>
            </div>
            <div className="w-[30%] h-full flex-col flex justify-center text-2xl">
              <div className="flex justify-start items-center w-full">
                <FaLongArrowAltUp className="text-red-500" />
                {temp_max}° C
              </div>
              <div className="flex justify-start items-center mt-6 w-full">
                <FaLongArrowAltDown className="text-green-500" /> {temp_min}° C
              </div>
            </div>
          </div>
          <div className="text-3xl h-1/4 flex items-center font-light px-3 bg-blue-600">
            <FaThermometerHalf />
            Feels like {feels_like}°C
          </div>
        </div>
        <div className="w-full  h-1/3 cflex flex-col bg-blue-400">
          <div className="text-4xl w-full flex px-4 font-semibold">
            {descHeading}
          </div>
          <div className="text-2xl w-full flex px-4">{description}</div>
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
            <span>
              {name}, {coutryCode}
            </span>
          </span>
          <span className=" h-full flex justify-end items-center w-40">
            {/* {Latitude & Longiture} */}
            <CiGlobe className="size-8 mr-2" />
            <div className="flex flex-col ">
              <span>{lat} °</span>
              <span>{lon} &apos;</span>
            </div>
          </span>
        </div>
        <div className="w-full grid grid-cols-2  h-2/3 text-2xl text-gray-800">
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsSunrise className={"size-8"} />
            </span>
            {/* <span className="heading">Sunrise</span> */}
            <span className="value">{sunrise}</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsSunset className={"size-8"} />
            </span>
            {/* <span className="heading">Sunset</span> */}
            <span className="value">{sunset}</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <FaCloudRain className={"size-8"} />
            </span>
            {/* <span className="heading">WindSpeed</span> */}
            <span className="value">{windSpeed}</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsCloudSun className={"size-8"} />
            </span>
            {/* <span className="heading">Clouds</span> */}
            <span className="value">{clouds}</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <WiFog className={"size-8"} />
            </span>
            {/* <span className="heading">Visibility</span> */}
            <span className="value">{visibility}</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <WiHumidity className={"size-10"} />
            </span>
            {/* <span className="heading">Humidity</span> */}
            <span className="value">{humidity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherCardWrapper = (data: {
  lat: number;
  lon: number;
  cityName: string;
}) => {
  const fetchWeatherDataBasedOnLatLon = async (lat: number, long: number) => {
    return (
      await axios.get(
        `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e47a80086b7f65b121c000fdb2e36153`
      )
    ).data as IWeatherData;
  };
  const { data: weatherData, isLoading: isLoadingWeatherData } = useQuery({
    queryKey: ["weather", data],
    queryFn: () => fetchWeatherDataBasedOnLatLon(data.lat, data.lon),
  });
  if (isLoadingWeatherData) return <LoadingSpinner />;
  if (!weatherData) return <>Undefined</>;
  return (
    <WeatherCard
      lon={weatherData.coord.lon}
      lat={weatherData.coord.lat}
      coutryCode={weatherData.sys.country}
      descHeading={weatherData.weather[0].main}
      description={weatherData.weather[0].description}
      icon={weatherData.weather[0].icon}
      temp={Math.round(weatherData.main.temp - 273)}
      feels_like={weatherData.main.feels_like}
      temp_min={weatherData.main.temp_min}
      temp_max={weatherData.main.temp_max}
      humidity={weatherData.main.humidity}
      windSpeed={weatherData.wind.speed}
      id={weatherData.id}
      name={data.cityName}
      sunrise={weatherData.sys.sunrise}
      sunset={weatherData.sys.sunset}
      visibility={weatherData.visibility}
      clouds={weatherData.clouds.all}
    />
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
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=e47a80086b7f65b121c000fdb2e36153`
    );
    const resData = (await res.json()).map((item: ICityFromAPI) => {
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
