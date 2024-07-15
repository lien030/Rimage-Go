import { FilterType, RimageConfig } from "@/type";
import { useTranslation } from "react-i18next";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Settings2, SquareFunction } from "lucide-react";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FluentArrowAutofitHeightDotted20Regular,
  FluentArrowAutofitWidthDotted20Regular,
} from "./Icons";

function CustomSlider({
  valueName,
  valueDescription,
  defaultValue,
  onValueChanged,
}: {
  valueName: string;
  valueDescription: string;
  defaultValue: number;
  onValueChanged: (value: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const { t } = useTranslation();

  return (
    <div className="h-[80px] flex flex-col justify-between p-3 select-none">
      <div className="flex justify-between">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{t(valueName)}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="whitespace-pre-line">{t(valueDescription)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="w-14 flex justify-center items-center border-zinc-300 border rounded-md bg-muted-foreground/5 ">
          <p>{value}</p>
        </div>
      </div>
      <Slider
        defaultValue={[defaultValue]}
        min={1}
        max={100}
        step={1}
        onValueChange={(value) => {
          setValue(value[0]);
          onValueChanged(value[0]);
        }}
        className="mb-1"
      />
    </div>
  );
}

function CustomSizeInput({
  valueName,
  defaultValue,
  isResize,
  onValueChanged,
}: {
  valueName: string;
  defaultValue: number;
  isResize: boolean;
  onValueChanged: (value: number) => void;
}) {
  const { t } = useTranslation();
  const valueInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-between items-center">
      <div className="w-6 h-6 flex justify-center items-center">
        {valueName === "width" ? (
          <FluentArrowAutofitWidthDotted20Regular fill="true" />
        ) : (
          <FluentArrowAutofitHeightDotted20Regular fill="true" />
        )}
      </div>
      <p className="text-nowrap mx-1 select-none">{t(valueName)}</p>
      <div className="flex">
        <Input
          ref={valueInput}
          className="h-8 w-[72px] text-end"
          min={0}
          defaultValue={defaultValue}
          disabled={!isResize}
          type="number"
          onChange={(e) => {
            onValueChanged(parseInt(e.target.value));
          }}
          onBlur={() => {
            if (
              parseInt(valueInput.current?.value as string) < 0 ||
              Number.isNaN(parseInt(valueInput.current?.value as string))
            ) {
              valueInput.current!.value = "0";
              onValueChanged(0);
            }
          }}
        />
        <p className="px-1">px</p>
      </div>
    </div>
  );
}

function GeneralOptions({
  rimageConfig,
}: {
  rimageConfig: React.MutableRefObject<RimageConfig>;
}) {
  const { t } = useTranslation();
  const [isResize, setIsResize] = useState(rimageConfig.current.resize);
  const theadsInput = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="flex items-center px-6 gap-2 select-none">
        <Settings2 className="text-primary" strokeWidth={1.8} size={24} />
        <p className="font-bold tracking-wide">{t("generalOptions")}</p>
      </div>
      <div className="flex gap-2 px-6">
        {/* Quality */}
        <div className="w-52 h-64 flex flex-col justify-around border border-zinc-300 rounded-lg bg-background/30">
          <CustomSlider
            valueName="quality"
            valueDescription="qualityDescription"
            defaultValue={rimageConfig.current.quality}
            onValueChanged={(value) => (rimageConfig.current.quality = value)}
          />
          <CustomSlider
            valueName="quantization"
            valueDescription="quantizationDescription"
            defaultValue={rimageConfig.current.quantization}
            onValueChanged={(value) =>
              (rimageConfig.current.quantization = value)
            }
          />
          <CustomSlider
            valueName="dithering"
            valueDescription="ditheringDescription"
            defaultValue={rimageConfig.current.dithering}
            onValueChanged={(value) => (rimageConfig.current.dithering = value)}
          />
        </div>
        {/* Resize & Threads*/}
        <div className="flex flex-col gap-2">
          {/* Resize */}
          <div className="w-52 flex flex-col border gap-1.5 border-zinc-300 rounded-lg bg-background/30 p-3">
            <div className="flex justify-between mb-1">
              <p>{t("resize")}</p>
              <Switch
                defaultChecked={rimageConfig.current.resize}
                onCheckedChange={(checked) => {
                  rimageConfig.current.resize = checked;
                  setIsResize(checked);
                }}
              />
            </div>
            <CustomSizeInput
              valueName="width"
              defaultValue={rimageConfig.current.resizeWidth}
              isResize={isResize}
              onValueChanged={(value) =>
                (rimageConfig.current.resizeWidth = value)
              }
            />
            <CustomSizeInput
              valueName="height"
              defaultValue={rimageConfig.current.resizeHeight}
              isResize={isResize}
              onValueChanged={(value) =>
                (rimageConfig.current.resizeHeight = value)
              }
            />
            <div className="flex justify-around items-center">
              <SquareFunction
                className="text-primary"
                size={20}
                strokeWidth={1}
              />
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-nowrap select-none">{t("filter")}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="whitespace-pre-line">
                      {t("filterDescription")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Select
                defaultValue={rimageConfig.current.filter}
                disabled={!isResize}
                onValueChange={(value) =>
                  (rimageConfig.current.filter = value as FilterType)
                }
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                  <SelectItem value="lanczos3">Lanczos3</SelectItem>
                  <SelectItem value="point">Point</SelectItem>
                  <SelectItem value="triangle">Tystem</SelectItem>
                  <SelectItem value="catrom">Catrom</SelectItem>
                  <SelectItem value="mitchell">Mitchell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Threads */}
          <div className="w-52 flex justify-between items-center grow border border-zinc-300 rounded-lg bg-background/30 py-2 px-3">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-nowrap select-none grow text-center">
                    {t("threads")}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="whitespace-pre-line">
                    {t("threadsDescription")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              ref={theadsInput}
              className="h-8 mx-2 text-end w-24"
              min={1}
              defaultValue={rimageConfig.current.threads}
              type="number"
              onBlur={() => {
                if (
                  rimageConfig.current.threads < 1 ||
                  Number.isNaN(rimageConfig.current.threads)
                ) {
                  rimageConfig.current.threads = 1;
                  if(theadsInput.current)
                  theadsInput.current.value = "1";
                }
              }}
              onChange={(e) =>
                (rimageConfig.current.threads = parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralOptions;
