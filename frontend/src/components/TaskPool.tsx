import { CookingPot, ImageUp, Plus, ScrollText, X } from "lucide-react";
import {
  EventsOff,
  EventsOn,
  OnFileDrop,
  OnFileDropOff,
} from "../../wailsjs/runtime/runtime";
import { useTranslation } from "react-i18next";
import { ParseFileName, FilePicker } from "../../wailsjs/go/main/App";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Task } from "@/type";
import useRimageConfig from "@/State";
import short from "short-uuid";
import mime from "mime";
import { ClearTaskChannel, SetTaskChannel } from "../../wailsjs/go/main/App";

export default function TaskPool() {
  const { t } = useTranslation();
  const config = useRimageConfig();

  useEffect(() => {
    const handleFileDrop = async (_x: number, _y: number, paths: string[]) => {
      // console.log(x, y);
      if (!paths || paths.length === 0) return;
      config.tasks = await mergeTasks({
        currentTasks: config.tasks,
        newPaths: paths,
      });
      if(config.running){
        ClearTaskChannel();
        SetTaskChannel(config.tasks);
      }
    };
    OnFileDrop(handleFileDrop, true);
    EventsOn("removeTask", (id: string) => {
      console.log("Removing task", id);
      handleDeleteTask(id);
      if(config.tasks.length === 0){
        ClearTaskChannel();
        config.running = false;
      }
    });
    return () => {
      OnFileDropOff();
      EventsOff("removeTask");
    };
  }, []);

  async function mergeTasks({
    currentTasks,
    newPaths,
  }: {
    currentTasks: Task[];
    newPaths: string[];
  }): Promise<Task[]> {
    // deduplicate
    newPaths = newPaths.filter((path) => {
      return !currentTasks.some((task) => task.filePath === path);
    });

    const tasks: Task[] = await Promise.all(
      newPaths.map(async (path) => {
        const fileName = await ParseFileName(path);
        return {
          id: short.generate(),
          status: "awaiting",
          filePath: path,
          fileName: fileName,
        };
      })
    );

    // filter out non-image files
    const validTasks = tasks.filter((task) => {
      const mimeType = mime.getType(task.fileName);
      return mimeType ? mimeType.includes("image") : false;
    });

    return currentTasks.concat(validTasks);
  }

  async function handleAddTask() {
    const response = await FilePicker();
    if (response.result) {
      config.tasks = await mergeTasks({
        currentTasks: config.tasks,
        newPaths: response.files,
      });
      if(config.running){
        ClearTaskChannel();
        SetTaskChannel(config.tasks);
      }
    }
  }

  function handleClear() {
    console.log("Clearing tasks");
    config.tasks = [];
  }

  function handleDeleteTask(id: string) {
    config.tasks = config.tasks.filter((task) => task.id !== id);
  }

  function TaskList({ tasks }: { tasks: Task[] }) {
    return tasks.map((task) => (
      <div
        className="w-full py-1 grid grid-cols-[300px,auto] rounded-md hover:bg-muted-foreground/5 transition-all select-none"
        key={task.id}
      >
        <div className="flex items-center px-2">
          <p className="w-full text-sm text-nowrap truncate">{task.fileName}</p>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className="w-4 h-4 bg-transparent hover:bg-transparent"
            size={"icon"}
            onClick={() => handleDeleteTask(task.id)}
          >
            <X size={16} className="text-primary" />
          </Button>
        </div>
      </div>
    ));
  }

  return (
    <>
      <div className="flex justify-between items-center px-2 select-none">
        <div className="flex gap-2">
          <ScrollText className="text-primary" strokeWidth={1.8} size={24} />
          <p className="font-bold tracking-wide">{t("taskpool")}</p>
        </div>
        <div className="flex gap-2 -my-4">
          <Button
            size={"icon"}
            onClick={handleAddTask}
            className="text-muted-foreground border h-7 w-12 rounded-lg"
          >
            <Plus size={16} className="text-white" />
          </Button>
          <Button
            size={"icon"}
            onClick={handleClear}
            className="text-muted-foreground bg-background hover:bg-muted-foreground/10 border h-7 w-10 rounded-lg"
          >
            <CookingPot size={16} />
          </Button>
        </div>
      </div>
      <div
        className={`w-full max-w-[366px] flex flex-col h-[172px] bg-background/30 rounded-lg overflow-y-auto p-2 relative overflow-x-hidden ${
          config.tasks.length === 0
            ? "border border-dashed border-muted-foreground/50"
            : "border"
        }`}
        style={{ "--wails-drop-target": "drop" } as React.CSSProperties}
      >
        {/* Mask */}
        <div
          className={`${
            config.tasks.length === 0 ? "flex" : "hidden"
          } drop-mask absolute w-full h-full bg-background/50 -m-2 flex-col gap-2 justify-center items-center text-muted-foreground`}
        >
          <ImageUp size={24} />
          <p className="text-sm select-none">{t("dragAndDrop")}</p>
        </div>
        {/* Content */}
        <TaskList tasks={config.tasks} />
      </div>
    </>
  );
}
