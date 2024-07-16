import TopBar from "./components/TopBar";
// import { useTranslation } from "react-i18next";
import "./i18n/config";
import { useRef } from "react";
import GeneralOptions from "./components/GeneralOptions";
import { RimageConfig } from "./type";
import OutputSettings from "./components/OutputSettings";

function App() {
  // const { t } = useTranslation();
  //to do: add 状态库

  const defaultRimageConfig: RimageConfig = {
    quality: 75,
    quantization: 100,
    dithering: 100,
    resize: false,
    resizeWidth: 0,
    resizeHeight: 0,
    filter: "lanczos3",
    threads: 4,
    backup: false,
    recursive: false,
    format: "mozjpeg",
    outputDir: "~/Downloads/Downloads/Downloads/Downloads/Downloads/Downloads",
    isResize: false,
    running: false,
  };

  const rimageConfig = useRef(defaultRimageConfig);

  return (
    <div className="min-h-screen h-screen min-w-screen w-screen bg-transparent relative">
      <TopBar />
      <div className="flex h-full w-full pt-14">
        <div className="flex flex-col gap-4">
          <GeneralOptions rimageConfig={rimageConfig} />
          <OutputSettings rimageConfig={rimageConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;
