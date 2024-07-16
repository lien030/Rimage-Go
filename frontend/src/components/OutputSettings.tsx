import { RimageConfig } from "@/type";
import { useTranslation } from "react-i18next";
import { FolderOutput } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";
import { useState } from "react";
import { Button } from "./ui/button";

function OutputSettings({
  rimageConfig,
}: {
  rimageConfig: React.MutableRefObject<RimageConfig>;
}) {
  const { t } = useTranslation();

  function CustomDirPicker({
    value,
  }: {
    value: string;
  }) {
    const [dir, setDir] = useState(value);

    async function onSelectedDir() {
      setDir("test");

    }

    return (
      <div className="h-9 w-full flex gap-2 select-none">
        <div className="h-full w-[294px] flex items-center border border-zinc-300 rounded-lg bg-muted-foreground/10 overflow-hidden">
          <p className="text-ellipsis text-sm text-muted-foreground overflow-hidden px-2">{dir}</p>
        </div>
        <Button size={"sm"} className="w-24 bg-muted-foreground/5 border-zinc-300 hover:bg-muted-foreground/10" variant={"outline"} onClick={onSelectedDir}>
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
      <div className="w-full h-12 px-6 pb-6 grow ">
        <div className="w-full h-full flex flex-col justify-between border border-zinc-300 rounded-lg bg-background/30 p-3">
          <div className="w-full grow grid grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="backupCheckbox"
                  defaultChecked={rimageConfig.current.backup}
                  onCheckedChange={(checked) =>
                    (rimageConfig.current.backup = Boolean(checked))
                  }
                />
                <Label htmlFor="backupCheckbox" className="text-base">
                  {t("backup")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="recursiveCheckbox"
                  defaultChecked={rimageConfig.current.recursive}
                  onCheckedChange={(checked) =>
                    (rimageConfig.current.recursive = Boolean(checked))
                  }
                />
                <Label htmlFor="recursiveCheckbox" className="text-base">
                  {t("recursive")}
                </Label>
              </div>
            </div>
            <div className="">format</div>
          </div>
          <div className="w-full">
            <CustomDirPicker
              value={rimageConfig.current.outputDir}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OutputSettings;
