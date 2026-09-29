"use client";

import * as React from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ZoomableBacktestImage({
  src,
  alt,
  width,
  height,
  zoomLabel,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  zoomLabel: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full overflow-hidden rounded-xl border border-border bg-card text-start"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg">
              <ZoomIn className="size-3.5" />
              {zoomLabel}
            </span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-none bg-transparent p-0 shadow-none sm:rounded-xl [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-background [&>button]:p-1.5">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full rounded-xl border border-border"
        />
      </DialogContent>
    </Dialog>
  );
}
