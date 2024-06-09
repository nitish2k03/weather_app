import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeButton = () => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <div>
      <input type="checkbox" className="checkbox shadow-xl" id="checkbox" />
      <label htmlFor="checkbox" className="checkbox-label drop-shadow-lg">
        <FaMoon className="text-gray-200" />
        <FaSun className="text-yellow-500" />
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default DarkModeButton;
