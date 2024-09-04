import TopBar from "./components/TopBar";
// import { useTranslation } from "react-i18next";
import "./i18n/config";
import GeneralOptions from "./components/GeneralOptions";
import OutputSettings from "./components/OutputSettings";
import TaskPool from "./components/TaskPool";
import Workers from "./components/Workers";
import ControlPanel from "./components/ControlPanel";
import { useEffect } from "react";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import { useToast } from "./components/ui/use-toast";

function App() {
  // const { t } = useTranslation();
  const { toast } = useToast();
  useEffect(() => {
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
    return () => {
      EventsOff("notify");
      EventsOff("error");
    };
  }, []);

  return (
    <div className="min-h-screen h-screen min-w-screen w-screen bg-transparent relative border">
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
