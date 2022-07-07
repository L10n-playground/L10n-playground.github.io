import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { MyAppShell } from "./AppShell/MyAppShell";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import React from "react";

export const LocalStorageTranslationsContext = React.createContext({
  setLocalStorageTranslations: (x: string) => {},
});

export const LocalStorageLocaleContext = React.createContext({
  localStorageLocale: "",
  setLocalStorageLocale: (x: string) => {},
});

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: useColorScheme("light"),
    getInitialValueInEffect: true,
  });

  const [localStorageTranslations, setLocalStorageTranslations] =
    useLocalStorage({ key: "translations" });

  const [localStorageLocale, setLocalStorageLocale] = useLocalStorage({
    key: "locale",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <LocalStorageTranslationsContext.Provider
      value={{ setLocalStorageTranslations }}
    >
      <LocalStorageLocaleContext.Provider
        value={{ localStorageLocale, setLocalStorageLocale }}
      >
        <IntlProvider
          messages={
            localStorageTranslations && JSON.parse(localStorageTranslations)
          }
          locale={localStorageLocale != "" ? localStorageLocale : "en"}
          defaultLocale="en"
          onError={(err) => {
            if (
              err.code === ReactIntlErrorCode.MISSING_TRANSLATION ||
              err.code === ReactIntlErrorCode.INVALID_CONFIG ||
              err.code === ReactIntlErrorCode.MISSING_DATA
            ) {
              console.warn(err.message);
              return;
            }

            throw err;
          }}
        >
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              theme={{ colorScheme }}
              withGlobalStyles
              withNormalizeCSS
            >
              <MyAppShell />
            </MantineProvider>
          </ColorSchemeProvider>
        </IntlProvider>
      </LocalStorageLocaleContext.Provider>
    </LocalStorageTranslationsContext.Provider>
  );
}
