import { Skeleton } from "@/components/ui/skeleton";
import { BsCloudSun, BsSunrise, BsSunset } from "react-icons/bs";
import { WiFog, WiHumidity } from "react-icons/wi";
import { CiGlobe } from "react-icons/ci";
import { Rubik } from "next/font/google";
import {
  FaCloudRain,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaRegCircle,
  FaThermometerHalf,
  FaWind,
} from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/lib/utils";
const tempConv = (temp: number) => {
  return Math.round(temp - 273);
};

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
      className={` w-full min-h-[600px] md:min-h-[400px] rounded-md flex lg:flex-row flex-col border-2 bg-black border-black dark:border-darkBorder ${RubikFont.className}`}
    >
      <div className=" h-full lg:w-1/3 w-full flex flex-col md:flex-row lg:flex-col border-r-2 border-black dark:border-darkBorder shadow-lg">
        <div className="h-full lg:h-2/3  w-full flex flex-col md:flex-row lg:flex-col text-white">
          <div className="w-full h-full lg:h-3/4 flex bg-indigo-600 flex-row lg:flex-row md:flex-col">
            <div className="w-full lg:w-3/4 h-full flex justify-center md:justify-start items-center">
              <div className=" h-full md:w-[70%] text-6xl xl:text-9xl pl-6 font-extrabold flex justify-center items-center">
                {tempConv(temp)}
              </div>
              <div className=" flex-col  p-2 w-1/4 text-2xl xl:text-6xl font-semibold flex justify-center items-start space-y-4">
                <div className="cflex">
                  <FaRegCircle className="size-2 xl:size-5 font-bold" />
                </div>
                <div className="cflex">C</div>
              </div>
            </div>
            <div className="lg:w-[30%] w-full h-full lg:flex-col  flex justify-center lg:text-2xl">
              <div className="flex justify-start items-center w-full">
                <FaLongArrowAltUp className="text-red-500" />
                {tempConv(temp_max)}° C
              </div>
              <div className="flex justify-start items-center lg:mt-6 w-full">
                <FaLongArrowAltDown className="text-green-500" />{" "}
                {tempConv(temp_min)}° C
              </div>
            </div>
          </div>
          <div className="lg:text-3xl text-lg h-full lg:h-1/4 flex items-center font-light px-2 bg-blue-600">
            <FaThermometerHalf />
            <div className="ml-2">Feels like {tempConv(feels_like)}°C</div>
          </div>
        </div>
        <div className="w-full h-full lg:h-1/3 cflex flex-col bg-blue-400 dark:text-white ">
          <div className="xl:text-4xl w-full flex px-4 font-semibold text-2xl">
            {descHeading}
          </div>
          <div className="text-xl lg:text-2xl w-full flex px-4">
            {description}
          </div>
        </div>
      </div>
      <div className=" h-full w-full lg:w-2/3 flex flex-col">
        <div className="w-full  h-1/3 p-4 bg-black text-white flex justify-between items-center">
          <span className="flex justify-start items-center font-semibold text-xl lg:text-4xl w-full ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10 lg:size-14 mr-3 md:-mt-1"
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
          <span className=" h-full flex justify-end items-center w-[50%]">
            {/* {Latitude & Longiture} */}
            <CiGlobe className="size-8 mr-2" />
            <div className="flex flex-col ">
              <span>{lat} °</span>
              <span>{lon} &apos;</span>
            </div>
          </span>
        </div>
        <div className="w-full flex flex-col md:grid md:grid-cols-2  h-2/3 text-lg xl:text-2xl bg-white dark:bg-darkbg dark:text-white  text-gray-800">
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsSunrise className={"size-8"} />
            </span>
            {/* <span className="heading">Sunrise</span> */}
            <span className="value dark:text-darkText">
              {new Date(sunrise).toLocaleTimeString()}
            </span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsSunset className={"size-8"} />
            </span>
            {/* <span className="heading">Sunset</span> */}
            <span className="value dark:text-darkText">
              {new Date(sunset).toLocaleTimeString()}
            </span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <FaWind className={"size-8"} />
            </span>
            {/* <span className="heading">WindSpeed</span> */}
            <span className="value dark:text-darkText">{windSpeed} m/s</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <BsCloudSun className={"size-8"} />
            </span>
            {/* <span className="heading">Clouds</span> */}
            <span className="value dark:text-darkText">{clouds} %</span>
          </div>
          <div className=" h-full cflex px-4 !justify-start">
            <span className="icon mr-3">
              <WiFog className={"size-8"} />
            </span>
            {/* <span className="heading">Visibility</span> */}
            <span className="value dark:text-darkText">{visibility} m</span>
          </div>
          <div className=" h-full cflex px-3 !justify-start">
            <span className="icon mr-3">
              <WiHumidity className={"size-10"} />
            </span>
            {/* <span className="heading">Humidity</span> */}
            <span className="value dark:text-darkText">{humidity} %</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherCardSkeleton = () => {
  return <Skeleton className="h-[400px] w-full rounded-xl bg-gray-200" />;
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
  if (isLoadingWeatherData)
    return (
      <div className="cflex w-full">
        <WeatherCardSkeleton />
      </div>
    );
  if (!weatherData) return <>Undefined</>;
  return (
    <WeatherCard
      lon={weatherData.coord.lon}
      lat={weatherData.coord.lat}
      coutryCode={weatherData.sys.country}
      descHeading={weatherData.weather[0].main}
      description={weatherData.weather[0].description}
      icon={weatherData.weather[0].icon}
      temp={weatherData.main.temp}
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
