
export type LanguagesType = "zh" | "en" | "ja";

export type FilterType = "lanczos3" | "point" | "triangle" | "catrom" | "mitchell";

export type OutputFormat = "mozjpeg" | "png" | "oxipng" | "jpegxl" | "webp" | "avif";

export const primaryBlack = "#303030";

export interface RimageConfig {
  quality: number;
  quantization: number;
  dithering: number;
  resize: boolean;
  resizeWidth: number;
  resizeHeight: number;
  filter: FilterType;
  threads: number;
  backup: boolean;
  recursive: boolean;
  format: OutputFormat;
  outputDir: string;
  isResize: boolean;
  running: boolean;
  tasks: Task[];
}

export interface Task {
  id: string;
  status: "awaiting" | "running" | "completed" | "failed";
  filePath: string;
  fileName: string;
}

export interface ProcessWorker {
  id: string;
  status: "sleeping" | "idle" | "working" | "failed";
  task?: Task;
}