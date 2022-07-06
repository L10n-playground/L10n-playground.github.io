import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Button,
  Checkbox,
} from "@mantine/core";
import { IconUpload, IconCheck, IconX, TablerIcon } from "@tabler/icons";
import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import { useCallback, useContext, useState } from "react";
import { useDidUpdate, useForm, useLocalStorage } from "@mantine/hooks";
import { FormattedMessage } from "react-intl";
import { LocalStorageTranslationsContext } from "../App";

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

  const form = useForm({
    initialValues: {
      translationFile: File.prototype,
    },
  });

  const { setLocalStorageTranslations } = useContext(
    LocalStorageTranslationsContext
  );

  const handleSubmit = async (values: typeof form.values) => {
    setLocalStorageTranslations(await values.translationFile.text());
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Dropzone
        onDrop={async (files) => {
          setDropzoneStatus({ accepted: true, rejected: false });
          const translationFile = files[0];
          form.setFieldValue("translationFile", translationFile);
        }}
        onReject={() => setDropzoneStatus({ accepted: false, rejected: true })}
        maxSize={10 * 1024 ** 2}
        accept={["application/json"]}
        multiple={false}
      >
        {() => dropzoneChildren(dropzoneStatus, theme)}
      </Dropzone>
      <FormattedMessage
        id="myMessage"
        defaultMessage="Today is {ts, date, ::yyyyMMdd}"
        values={{ ts: Date.now() }}
      />
      <Button type="submit">Click to save</Button>
      
      <Button onClick={() => setLocalStorageTranslations("")}>Clear translations</Button>
    </form>
  );
}
