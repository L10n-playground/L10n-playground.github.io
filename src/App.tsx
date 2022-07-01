import { AppShell, Navbar, Header, Button } from '@mantine/core';

export default function MyApp() {
  return (
  <AppShell
      padding="lg"
      navbar={<Navbar width={{ base: 300 }} height={500} p="xs">{/* Navbar content */}</Navbar>}
      header={<Header height={60} p="xs">{/* Header content */}</Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
    <Button>Hello world!</Button>
    </AppShell>
  );
}