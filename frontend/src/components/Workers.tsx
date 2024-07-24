import { Minus, Pickaxe, Plus, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { ProcessWorker, Task } from "@/type";
import { useWorkerConfig } from "@/State";
import shortUUID from "short-uuid";
import { NewWorker, RemoveWorker } from "../../wailsjs/go/main/App";
import { useToast } from "./ui/use-toast";

export default function Workers() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const workersList = useWorkerConfig();
  async function handleAddWorker() {
    // workersList.push({ id: shortUUID.generate(), status: "idle" });
    const newWorker: ProcessWorker = {
      id: shortUUID.generate(),
      status: "idle",
      task: undefined,
    };
    const response = await NewWorker({
      id: newWorker.id,
      status: newWorker.status,
      task: {
        id: "",
        status: "",
        filePath: "",
        fileName: "",
      },
      convertValues: function (_a: any, _classs: any, _asMap?: boolean) {
        throw new Error("Function not implemented.");
      }
    });
    if (response) {
      workersList.push(newWorker);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add worker",
        duration: 2500,
      });
    }
  }

  async function handleRemoveWorker() {
    // workersList.pop();
    // get last worker id
    const lastWorker = workersList[workersList.length - 1];
    const response = await RemoveWorker(lastWorker.id);
    if (response) {
      workersList.pop();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove worker",
        duration: 2500,
      });
    }
  }

  function AddWorkerButton() {
    return (
      <Button
        asChild
        className="bg-muted-foreground/10 hover:bg-muted-foreground/30"
        onClick={handleAddWorker}
      >
        <div className="h-10 m-1 rounded-sm flex justify-center items-center hover:cursor-pointer">
          <Plus size={20} className="text-primary/50" />
        </div>
      </Button>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center px-2 select-none">
        <div className="flex gap-2">
          <Pickaxe className="text-primary" strokeWidth={1.8} size={24} />
          <p className="font-bold tracking-wide">{t("workers")}</p>
        </div>
        <div className="flex gap-2 -my-4">
          <Button
            size={"icon"}
            onClick={handleAddWorker}
            className="text-muted-foreground border h-7 w-12 rounded-lg"
          >
            <Plus size={16} className="text-white" />
          </Button>
          <Button
            size={"icon"}
            onClick={handleRemoveWorker}
            className="text-muted-foreground bg-background hover:bg-muted-foreground/10 border h-7 w-10 rounded-lg"
          >
            <Minus size={16} />
          </Button>
        </div>
      </div>
      <div className="w-full h-[154px] bg-background/50 rounded-lg overflow-y-auto p-1 grid grid-cols-[50%,50%] auto-rows-min">
        {workersList.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
        <AddWorkerButton />
      </div>
    </>
  );
}

function WorkerCard({ worker }: { worker?: ProcessWorker }) {
  const getStatusColor = (worker: { status: string } | undefined) => {
    if (!worker || worker.status === "failed") return "bg-red-500";
    return worker.status === "idle" ? "bg-green-500" : "bg-orange-500";
  };

  function TaskDetails({ task }: { task: Task | undefined }) {
    if (!task && worker?.status === "idle") {
      return (
        <p className="w-full text-sm text-nowrap truncate">
          <Smile size={20} className="text-primary" />
        </p>
      );
    }
    return (
      <p className="w-full text-sm text-nowrap truncate">{task?.fileName}</p>
    );
  }

  return (
    <div className="h-10 border border-zinc-300 bg-muted-foreground/5 m-1 rounded-sm grid grid-cols-[auto,130px]">
      <div className="flex justify-center items-center">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(worker)}`} />
      </div>
      <div className="w-full flex items-center">
        <TaskDetails task={worker?.task} />
      </div>
    </div>
  );
}
