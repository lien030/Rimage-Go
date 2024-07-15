import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CSSProperties, useEffect, useState } from "react";
import { Minus, X, Pin, PinOff, Languages } from "lucide-react";
import { Button } from "./ui/button";
import {
  WindowMinimise,
  Quit,
  WindowSetAlwaysOnTop,
} from "../../wailsjs/runtime/runtime";
import { LanguagesType } from "@/type";
import { useTranslation } from "react-i18next";

function TopBar() {
  const [isPinned, setIsPinned] = useState(false);
  const { i18n } = useTranslation();
  useEffect(() => {
    WindowSetAlwaysOnTop(false);
  }, []);

  function onClosed() {
    // console.log("closed");
    Quit();
  }

  function onMinimise() {
    // console.log("minimise");
    WindowMinimise();
  }

  function onPinned() {
    // console.log("tapped");
    WindowSetAlwaysOnTop(!isPinned);
    setIsPinned(!isPinned);
  }

  function onLanguages(lang: LanguagesType) {
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  }

  return (
    <header
      className="absolute top-0 h-14 w-full flex justify-between items-center px-4 select-none"
      style={
        {
          "--wails-draggable": "drag",
        } as CSSProperties
      }
    >
      <p className="font-semibold text-lg text-primary">
        Rimage Go
      </p>
      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-200/50 h-8 w-8"
            >
              <Languages color="#888888" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            //https://github.com/radix-ui/primitives/issues/1803#issuecomment-1868467121
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {/* <DropdownMenuLabel>Languages</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={() => {
                onLanguages("zh");
              }}
            >
              简体中文
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onLanguages("ja");
              }}
            >
              日本語
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onLanguages("en");
              }}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-200/50 h-8 w-8"
          onClick={onPinned}
        >
          {isPinned ? (
            <Pin size={18} color="#888888" />
          ) : (
            <PinOff size={18} color="#888888" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-200/50 h-8 w-8"
          onClick={onMinimise}
        >
          <Minus size={18} color="#888888" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-200/50 h-8 w-8"
          onClick={onClosed}
        >
          <X size={18} color="#888888" />
        </Button>
      </div>
    </header>
  );
}

export default TopBar;
