"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateDeckMarkdown } from "../actions";

interface DownloadDeckButtonProps {
  deckId: number;
}

export function DownloadDeckButton({ deckId }: DownloadDeckButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    try {
      setIsDownloading(true);

      // Generate markdown from server action
      const result = await generateDeckMarkdown(deckId);

      if (!result.success || !result.markdown) {
        throw new Error("Failed to generate markdown");
      }

      // Create a blob from the markdown content
      const blob = new Blob([result.markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download deck:", error);
      alert("Failed to download deck. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      className="text-sm"
    >
      <Download className="mr-2 h-4 w-4" />
      <span className="hidden xs:inline">{isDownloading ? "Generating..." : "Download as Markdown"}</span>
      <span className="xs:hidden">{isDownloading ? "..." : "Download"}</span>
    </Button>
  );
}

