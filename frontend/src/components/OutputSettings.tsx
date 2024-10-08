import { useTranslation } from "react-i18next";
import { FolderOutput } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import useRimageConfig from "@/State";
import { Input } from "./ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  IsDirectory,
  DirectoryPicker,
  GetUserDownloadsDir,
} from "../../wailsjs/go/main/App";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutputFormat } from "@/type";
import { useEffect } from "react";
import isValidFilename from "valid-filename";

function OutputSettings() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const config = useRimageConfig();

  useEffect(() => {
    const setDefaultOutputDir = async () => {
      const path = await GetUserDownloadsDir();
      if (path) {
        config.outputDir = path.dir;
      }
    };
    setDefaultOutputDir();
  }, []);

  function CustomDirPicker({
    directory,
    disabled,
  }: {
    directory: string;
    disabled?: boolean;
  }) {
    const config = useRimageConfig();

    async function onSelectedDir() {
      // console.log(JSON.stringify(config));
      const response = await DirectoryPicker();
      // console.log(JSON.stringify(response));
      if (response.result) {
        const isValid = await IsDirectory(response.dir);
        if (isValid) {
          config.outputDir = response.dir;
        } else {
          toast({
            variant: "destructive",
            title: t("pathError"),
            description: t("pathErrorDescription"),
            duration: 2500,
          });
        }
      }
    }

    async function onInputBlur(e: React.FocusEvent<HTMLInputElement>) {
      const response = await IsDirectory(e.target.value);
      if (!response) {
        toast({
          variant: "destructive",
          title: t("pathError"),
          description: t("pathErrorDescription"),
          duration: 2500,
        });
      }else {
        config.outputDir = e.target.value;
      }
    }

    return (
      <div className="h-9 w-full flex gap-2 select-none">
        <div className="h-full w-[294px] flex items-center border border-zinc-300 rounded-lg bg-muted-foreground/10 overflow-hidden">
          {/* <p className="text-ellipsis text-sm text-muted-foreground overflow-hidden px-2">{dir}</p> */}
          <Input
            defaultValue={directory}
            disabled={disabled}
            className="disabled:cursor-default"
            onBlur={onInputBlur}
          />
        </div>
        <Button
          size={"sm"}
          className="w-24 bg-muted-foreground/5 border-zinc-300 hover:bg-muted-foreground/10"
          variant={"outline"}
          onClick={onSelectedDir}
          disabled={config.recursive}
        >
          {t("selectDirectory")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center px-6 gap-2 select-none">
        <FolderOutput className="text-primary" strokeWidth={1.8} size={24} />
        <p className="font-bold tracking-wide">{t("outputSettings")}</p>
      </div>
      <div className="w-full h-12 px-4 pb-4 grow ">
        <div className="w-full h-full flex flex-col justify-between border border-zinc-300 rounded-lg bg-background/30 p-3">
          <div className="w-full grow grid grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="backupCheckbox"
                  defaultChecked={config.backup}
                  onCheckedChange={(checked) =>
                    (config.backup = Boolean(checked))
                  }
                />
                <Label htmlFor="backupCheckbox" className="text-base">
                  {t("backup")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="recursiveCheckbox"
                  defaultChecked={config.recursive}
                  onCheckedChange={(checked) =>
                    (config.recursive = Boolean(checked))
                  }
                />
                <Label htmlFor="recursiveCheckbox" className="text-base">
                  {t("recursive")}
                </Label>
              </div>
            </div>
            <div className="flex flex-col gap-1 max-w-[199px]">
              <div className="flex items-center gap-1">
                <p className="text-nowrap">{t("format")}</p>
                <Select
                  defaultValue={config.format}
                  onValueChange={(value) =>
                    (config.format = value as OutputFormat)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <SelectItem value="mozjpeg">Mozjpeg(.jpg)</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="oxipng">Oxipng</SelectItem>
                    <SelectItem value="jpegxl">JPEG XL</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-nowrap">{t("suffix")}</p>
                <Input
                  className="h-8 text-end max-w-[162px]"
                  defaultValue={config.suffix}
                  onBlur={(e) => {
                    const suffix = e.target.value;
                    if(suffix === ""){
                      config.suffix = suffix;
                      return;
                    }
                    const valid = isValidFilename(suffix);
                    if (valid) {
                      config.suffix = suffix;
                    } else {
                      toast({
                        variant: "destructive",
                        title: t("suffixError"),
                        description: t("suffixErrorDescription"),
                        duration: 2500,
                      });
                      e.target.value = config.suffix;
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <CustomDirPicker
              directory={config.outputDir}
              disabled={config.recursive}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OutputSettings;
