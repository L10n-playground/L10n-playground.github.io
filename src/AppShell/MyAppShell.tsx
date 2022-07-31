import {
  AppShell,
  Navbar,
  Header,
  Button,
  ActionIcon,
  Group,
  useMantineColorScheme,
  Aside,
  Footer,
  MediaQuery,
  Burger,
  useMantineTheme,
  Tooltip,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconLanguage,
  IconMoonStars,
  IconSettings,
  IconSunHigh,
} from "@tabler/icons";
import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { TranslationDropzone } from "../UploadTranslation/TranslationDropzone";
import { MainLinks } from "./MainLinks";
import { User } from "./User";

export function MyAppShell() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [responsiveMenuOpened, setResponsiveMenuOpened] = useState(false);

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!responsiveMenuOpened}
          width={{ sm: 280 }}
        >
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200 }}>
            Application sidebar
          </Aside>
        </MediaQuery>
      }
      footer={
        <Footer height={70} p="md">
          <Button
            component="a"
            href="https://github.com/L10n-playground/L10n-playground.github.io"
            target={"_blank"}
            variant="default"
            leftIcon={<IconBrandGithub size={24} />}
          >
            Source code
          </Button>
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
              alignItems: "center",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={responsiveMenuOpened}
                onClick={() => setResponsiveMenuOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Button
              component={Link}
              to="/"
              leftIcon={<IconLanguage />}
              variant="default"
            >
              Localization playground
            </Button>
            <Group>
              <Tooltip label="Settings" withinPortal={true}>
                <ActionIcon
                  component={Link}
                  to={
                    useLocation().pathname === "/settings" ? "/" : "/settings"
                  }
                  variant="default"
                  size={40}
                >
                  <IconSettings size={24} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={`${colorScheme === "dark" ? "Light" : "Dark"} mode`}
                withinPortal={true}
              >
                <ActionIcon
                  variant="default"
                  onClick={() => toggleColorScheme()}
                  size={40}
                >
                  {colorScheme === "dark" ? (
                    <IconSunHigh size={22} />
                  ) : (
                    <IconMoonStars size={22} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Routes>
        <Route path="/settings" element={<TranslationDropzone />} />
        <Route
          path="/"
          element={<Title order={1}>Welcome to Localization playground</Title>}
        />
      </Routes>
    </AppShell>
  );
}
