import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FileUpload,
  FileUploadList,
  FileUploadItem,
  type FileRejection
} from "@aura/ui/file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "UI/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  args: { variant: "dashed", multiple: true },
  argTypes: {
    variant: { control: "select", options: ["dashed", "soft", "glass", "glow", "3d"] }
  },
  decorators: [(Story) => <div className="w-[440px]">{Story()}</div>]
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};

const reasonText: Record<string, string> = {
  "file-too-large": "maior que 2 MB",
  "file-invalid-type": "tipo não permitido",
  "too-many-files": "limite de 3 arquivos"
};

export const ImagesWithLimits: Story = {
  render: function ImagesStory() {
    const [errors, setErrors] = React.useState<string[]>([]);
    return (
      <div className="flex flex-col gap-2">
        <FileUpload
          variant="3d"
          accept="image/*"
          multiple
          maxFiles={3}
          maxSize={2 * 1024 * 1024}
          onFilesChange={() => setErrors([])}
          onReject={(rejections: FileRejection[]) =>
            setErrors(
              rejections.map(
                (r) => `${r.file.name}: ${r.reasons.map((x) => reasonText[x]).join(", ")}`
              )
            )
          }
        />
        {errors.map((e) => (
          <p key={e} role="alert" className="text-xs text-aura-destructive">
            {e}
          </p>
        ))}
      </div>
    );
  }
};

export const CustomListWithProgress: Story = {
  render: function ProgressStory() {
    const [files, setFiles] = React.useState<File[]>([]);
    const [progress, setProgress] = React.useState<Record<string, number>>({});

    React.useEffect(() => {
      if (!files.length) return;
      const id = window.setInterval(() => {
        setProgress((p) => {
          const next = { ...p };
          for (const f of files) next[f.name] = Math.min(100, (next[f.name] ?? 0) + 8);
          return next;
        });
      }, 250);
      return () => window.clearInterval(id);
    }, [files]);

    return (
      <div className="flex flex-col gap-3">
        <FileUpload
          variant="soft"
          multiple
          value={files}
          onFilesChange={setFiles}
          showList={false}
        />
        <FileUploadList>
          {files.map((f) => (
            <FileUploadItem
              key={f.name}
              file={f}
              progress={progress[f.name] ?? 0}
              onRemove={() => setFiles((list) => list.filter((x) => x !== f))}
            />
          ))}
        </FileUploadList>
      </div>
    );
  }
};

export const Glass: Story = {
  render: () => (
    <div className="rounded-2xl bg-aura-contrast p-6">
      <FileUpload variant="glass" accept=".pdf,.docx" />
    </div>
  )
};
