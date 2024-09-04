import TopBar from "./components/TopBar";
// import { useTranslation } from "react-i18next";
import "./i18n/config";
import GeneralOptions from "./components/GeneralOptions";
import OutputSettings from "./components/OutputSettings";
import TaskPool from "./components/TaskPool";
import Workers from "./components/Workers";
import ControlPanel from "./components/ControlPanel";
import { useEffect, useState } from "react";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import { useToast } from "./components/ui/use-toast";
import { IsWin11 } from "../wailsjs/go/main/App";

function App() {
  // const { t } = useTranslation();
  const { toast } = useToast();
  const [isWin11, setIsWin11] = useState(false);

  useEffect(() => {
    async function checkWin11() {
      const response = await IsWin11();
      if (response) {
        setIsWin11(true);
      }
    }
    EventsOn("notify", (message: string) => {
      toast({
        title: "Debug",
        description: message,
        duration: 5000,
      });
    });
    EventsOn("error", (message: string) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
        duration: 5000,
      });
    });
    checkWin11();
    return () => {
      EventsOff("notify");
      EventsOff("error");
    };
  }, []);

  return (
    <div
      className={`min-h-screen h-screen min-w-screen w-screen backdrop-blur-md rounded-lg relative border ${
        isWin11 ? "bg-transparent" : "bg-[rgba(248,249,253,0.95)]"
      }`}
    >
      <TopBar />
      <div className="flex h-full w-full pt-14">
        <div className="flex flex-col gap-4">
          <GeneralOptions />
          <OutputSettings />
        </div>
        <div className="flex flex-col gap-4 pr-4 grow">
          <TaskPool />
          <Workers />
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
