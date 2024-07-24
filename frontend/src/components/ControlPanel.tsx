import { Square, Play } from "lucide-react";
import { Button } from "./ui/button";
import useRimageConfig from "@/State";

export default function ControlPanel() {
  const config = useRimageConfig();

  function handleButtonClick() {
    config.running = !config.running;
  }

  return (
    <div className="h-12 w-full flex gap-2 justify-end select-none">
      <Button
        className={`w-full h-full transition-all ${
          config.running
            ? "bg-red-50 hover:bg-red-100 border border-red-600"
            : ""
        }`}
        onClick={handleButtonClick}
      >
        {!config.running && (
          <Play size={18} fill="white" className="text-white" />
        )}
        {config.running && (
          <Square size={18} className="text-red-600" />
        )}
        {!config.running && <p className="mx-2 font-bold text-lg">GO</p>}
        {config.running && <p className="mx-2 font-bold text-lg text-red-600">STOP</p>}
      </Button>
    </div>
  );
}
