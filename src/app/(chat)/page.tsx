import MainInput from "@/components/main-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PromptInputBox } from "@/components/ai-prompt-box";

export default function Home() {
  const handleSendMessage = (message: string, files?: File[]) => {
    console.log("Message:", message);
    console.log("Files:", files);
  };
  return (
    <div className="h-screen flex justify-center">
      <div className="flex items-end w-full max-w-2xl">
        <MainInput />
      </div>
    </div>
  );
}
