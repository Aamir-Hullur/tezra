"use client";

import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}

export const VoiceRecorder = memo(
  ({
    isRecording,
    onStartRecording,
    onStopRecording,
    visualizerBars = 32,
  }: VoiceRecorderProps) => {
    const [time, setTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (isRecording) {
        onStartRecording();
        timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onStopRecording(time);
        setTime(0);
      }
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [isRecording, time, onStartRecording, onStopRecording]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center py-3 transition-all duration-300",
          isRecording ? "opacity-100" : "h-0 opacity-0",
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-foreground font-mono text-sm">
            {formatTime(time)}
          </span>
        </div>
        <div className="flex h-10 w-full items-center justify-center gap-0.5 px-4">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className="bg-foreground/50 w-0.5 animate-pulse rounded-full"
              style={{
                height: `${Math.max(15, Math.random() * 100)}%`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  },
);

VoiceRecorder.displayName = "VoiceRecorder";
