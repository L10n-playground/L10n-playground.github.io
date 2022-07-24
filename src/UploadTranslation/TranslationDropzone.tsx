import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Button,
  Select,
  Space,
} from "@mantine/core";
import { IconUpload, IconCheck, IconX, TablerIcon } from "@tabler/icons";
import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import { forwardRef, useContext, useState } from "react";
import { useForm } from "@mantine/hooks";
import { FormattedMessage } from "react-intl";
import {
  LocalStorageLocaleContext,
  LocalStorageTranslationsContext,
} from "../App";
import languages from "../languages.json";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <IconCheck {...props} />;
  }

  if (status.rejected) {
    return <IconX {...props} />;
  }

  return <IconUpload {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

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

export function TranslationDropzone() {
  const theme = useMantineTheme();
  const [dropzoneStatus, setDropzoneStatus] = useState<DropzoneStatus>({
    accepted: false,
    rejected: false,
  });

  const { setLocalStorageTranslations } = useContext(
    LocalStorageTranslationsContext
  );

  const { localStorageLocale, setLocalStorageLocale } = useContext(
    LocalStorageLocaleContext
  );

  const form = useForm({
    initialValues: {
      translationFile: File.prototype,
      locale: localStorageLocale,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLocalStorageLocale(values.locale);
    values.translationFile instanceof File &&
      setLocalStorageTranslations(await values.translationFile.text());
    setDropzoneStatus({ accepted: false, rejected: false });
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Dropzone
          onDrop={async (files) => {
            setDropzoneStatus({ accepted: true, rejected: false });
            const translationFile = files[0];
            form.setFieldValue("translationFile", translationFile);
          }}
          onReject={() =>
            setDropzoneStatus({ accepted: false, rejected: true })
          }
          maxSize={10 * 1024 ** 2}
          accept={["application/json"]}
          multiple={false}
        >
          {() => dropzoneChildren(dropzoneStatus, theme)}
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
