import { RimageConfig } from "./type";
import { proxy } from "valtio";
import { useProxy } from "valtio/utils";

export const defaultData: RimageConfig = {
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

const rimageConfig = proxy(defaultData);

const useRimageConfig = () => useProxy(rimageConfig);
export default useRimageConfig;