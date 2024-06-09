import { AxiosRequestConfig } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const config: AxiosRequestConfig = {
  headers: {
    Host: "api.openweathermap.org",
    Origin: "https://weather-r6p26eu9y-nitish2k03s-projects.vercel.app",
    Referer: "https://weather-r6p26eu9y-nitish2k03s-projects.vercel.app/",
    Accept: "application/json, text/plain, */*",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
  },
};
