import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { MyAppShell } from "./AppShell/MyAppShell";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { IntlProvider } from "react-intl";
import React, { useMemo } from "react";

export const LocalStorageTranslationsContext = React.createContext({
  localStorageTranslations: "",
  setLocalStorageTranslations: (x: string) => {},
});

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: useColorScheme("light"),
    getInitialValueInEffect: true,
  });

  const [localStorageTranslations, setLocalStorageTranslations] =
    useLocalStorage({ key: "translations" });

  const localStorageTranslationsValue = useMemo(
    () => ({ localStorageTranslations, setLocalStorageTranslations }),
    [localStorageTranslations]
  );

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <LocalStorageTranslationsContext.Provider
      value={localStorageTranslationsValue}
    >
      <IntlProvider
        messages={
          localStorageTranslations && JSON.parse(localStorageTranslations)
        }
        locale="fr"
        defaultLocale="en"
        onError={(err) => {
          if (err.code === "MISSING_TRANSLATION") {
            console.warn("Missing translation", err.message);
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
    </LocalStorageTranslationsContext.Provider>
  );
}
