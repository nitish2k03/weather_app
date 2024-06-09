"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { config } from "@/lib/utils";
import { WeatherCardWrapper } from "@/components/WeatherCard";
import { isCityInArray, SideBar } from "@/components/SideBar";

const queryClient = new QueryClient();

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
  const [localStorageGetterSetterDone, setLocalStorageGetterSetterDone] =
    useState(false);
  const [currentCity, setCurrentCity] = useState<ICityFromAPI | null>(null);
  const [visibleCities, setVisibleCities] = useState<ICityFromAPI[]>([]);
  const [savedCityCoordinates, setSavedCityCoordinates] = useState<
    ICityFromAPI[]
  >([]);

  useEffect(() => {
    if (localStorageGetterSetterDone) {
      // if city not in saved city it should be removed from visible cities as well
      setVisibleCities(
        visibleCities.filter((city) =>
          isCityInArray(city, savedCityCoordinates)
        )
      );
    }
  }, [savedCityCoordinates]);

  useEffect(() => {
    if (!debouncedSearchTerm) return;
    setLoading(true);
    handleSearch(debouncedSearchTerm);
    setLoading(false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    //store savedcitycoordinates and visiblecities in localstorage
    if (localStorageGetterSetterDone) {
      localStorage.setItem(
        "savedCityCoordinates",
        JSON.stringify(savedCityCoordinates)
      );
      localStorage.setItem("visibleCities", JSON.stringify(visibleCities));
    }
  }, [savedCityCoordinates, visibleCities]);

  //get the saved city coordinates from localstorage on page load
  useEffect(() => {
    if (window.location !== undefined && !localStorageGetterSetterDone) {
      const savedCityCoordinates = JSON.parse(
        localStorage.getItem("savedCityCoordinates") || "[]"
      ) as ICityFromAPI[];
      const visibleCities = JSON.parse(
        localStorage.getItem("visibleCities") || "[]"
      ) as ICityFromAPI[];
      setSavedCityCoordinates(savedCityCoordinates);
      setVisibleCities(visibleCities);
      setLocalStorageGetterSetterDone(true);
    }
  }, []);
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
        {visibleCities.map((city, index) => (
          <WeatherCardWrapper
            key={`${city.lat}-${index}`}
            lat={city.lat}
            lon={city.lon}
            cityName={city.name}
          />
        ))}
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
