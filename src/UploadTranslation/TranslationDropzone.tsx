import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Button,
  Select,
  Space,
} from "@mantine/core";
import { IconUpload, IconCheck, IconX } from "@tabler/icons";
import { Dropzone } from "@mantine/dropzone";
import { useContext } from "react";
import { useForm } from "@mantine/form";
import { FormattedMessage } from "react-intl";
import {
  LocalStorageLocaleContext,
  LocalStorageTranslationsContext,
} from "../App";
import languages from "../languages.json";

export function TranslationDropzone() {
  const theme = useMantineTheme();

  const { setLocalStorageTranslations } = useContext(
    LocalStorageTranslationsContext
  );

  const { localStorageLocale, setLocalStorageLocale } = useContext(
    LocalStorageLocaleContext
  );

  interface FormValues {
    translationFile: File | undefined;
    locale: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      translationFile: undefined,
      locale: localStorageLocale,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLocalStorageLocale(values.locale);
    values.translationFile instanceof File &&
      setLocalStorageTranslations(await values.translationFile.text());
    form.setFieldValue("translationFile", undefined);
  };

  function dropzoneContent(theme: MantineTheme) {
    return (
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: 220, pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconCheck
            size={50}
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          {form.values.translationFile ? (
            <IconCheck
              size={50}
              stroke={1.5}
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === "dark" ? 4 : 6
                ]
              }
            />
          ) : (
            <IconUpload size={50} stroke={1.5} />
          )}
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag translation file here or click to select it
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach one translation file, it should not exceed 10 MB
          </Text>
        </div>
      </Group>
    );
  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Dropzone
          onDrop={async (files) => {
            const translationFile = files[0];
            form.setFieldValue("translationFile", translationFile);
          }}
          maxSize={10 * 1024 ** 2}
          accept={["application/json"]}
          multiple={false}
        >
          {dropzoneContent(theme)}
        </Dropzone>

        <Select
          label="Select your language"
          placeholder="Pick one"
          searchable
          clearable
          data={Object.entries(languages).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          {...form.getInputProps("locale")}
        />
        <Space h="md" />
        <Button type="submit">Click to save</Button>
      </form>
      <Space h="md" />
      <Button onClick={() => setLocalStorageTranslations("")}>
        Clear translations
      </Button>

      <Space h="md" />
      <Button component="a" download={"english.json"} href="english.json">
        Download translation file
      </Button>
      <Space h="md" />
      <FormattedMessage
        id="myMessage"
        defaultMessage="Today is {ts, date, full}"
        values={{ ts: Date.now() }}
        description="Showing the current day"
      />
      <Space h="md" />
      <FormattedMessage
        id="myPluralization"
        defaultMessage="I have {count, plural, one {a dog} other {# dogs}}"
        values={{ count: 0 }}
        description="Pluralization of dogs"
      />
    </>
  );
}
