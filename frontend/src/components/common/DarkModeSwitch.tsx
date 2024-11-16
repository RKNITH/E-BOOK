import { Switch } from "@nextui-org/react";
import { FC, useEffect, useCallback, useState } from "react";
import { IoMoon, IoSunnyOutline } from "react-icons/io5";

interface Props {}

const DarkModeSwitch: FC<Props> = () => {
  const [darkMode, setDarkMode] = useState(false);

  const updateLocalStorage = (themeMode?: "dark") => {
    if (themeMode) localStorage.setItem("theme", themeMode);
    else localStorage.removeItem("theme");
  };

  const enableDarkMode = useCallback(() => {
    document.documentElement.classList.add("dark");
    updateLocalStorage("dark");
    setDarkMode(true);
  }, []);

  const disableDarkMode = () => {
    document.documentElement.classList.remove("dark");
    updateLocalStorage();
  };

  useEffect(() => {
    const result = localStorage.getItem("theme");
    if (result === "dark") {
      enableDarkMode();
    }
  }, [enableDarkMode]);

  return (
    <Switch
      size="sm"
      color="success"
      startContent={<IoSunnyOutline />}
      endContent={<IoMoon />}
      isSelected={darkMode}
      onChange={(e) => {
        const { checked } = e.target;
        if (checked) enableDarkMode();
        else disableDarkMode();
        setDarkMode(checked);
      }}
    />
  );
};

export default DarkModeSwitch;
