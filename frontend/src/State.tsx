import { ProcessWorker, RimageConfig } from "./type";
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
  outputDir: "~/Downloads",
  isResize: false,
  running: false,
  tasks: [],
};

const rimageConfig = proxy(defaultData);

const useRimageConfig = () => useProxy(rimageConfig);
export default useRimageConfig;

export const defaultWorkerData:ProcessWorker[] = [];
const workerConfig = proxy(defaultWorkerData);
export const useWorkerConfig = () => useProxy(workerConfig);