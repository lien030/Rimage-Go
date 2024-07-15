import { useEffect } from "react";
import {OnFileDrop, OnFileDropOff } from "../../wailsjs/runtime/runtime";

function FileHoverMask() {
  
  useEffect(()=>{
    OnFileDrop((x, y, paths) => {
      console.log(x, y, "Dropped files: ", paths);
    }, true);
    return () => OnFileDropOff();
  },[])

  return (
    <div className="absolute w-full h-full" style={{"--wails-drop-target": "drop"} as React.CSSProperties}>
    </div>
  );
}

export default FileHoverMask;