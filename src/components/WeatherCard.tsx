import { BsCloudSun, BsSunrise, BsSunset } from "react-icons/bs";
import { WiFog, WiHumidity } from "react-icons/wi";
import { CiGlobe } from "react-icons/ci";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Rubik } from "next/font/google";
import {
  FaCloudRain,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaRegCircle,
  FaThermometerHalf,
} from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/lib/utils";

const RubikFont = Rubik({
  subsets: ["latin"],
});
export const WeatherCard = ({
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

export const WeatherCardWrapper = (data: {
  lat: number;
  lon: number;
  cityName: string;
}) => {
  const fetchWeatherDataBasedOnLatLon = async (lat: number, long: number) => {
    return (
      await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e47a80086b7f65b121c000fdb2e36153`,
        config
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
