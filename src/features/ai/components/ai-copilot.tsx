import { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, Send, X, Trash2, ArrowRight } from "lucide-react";
import { useAIStore } from "@/shared/stores/ai-store";
import { cn } from "@/lib/utils";

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { chatHistory, sendCopilotQuery, clearChat, isLoading, initializeAIStore } = useAIStore();

  useEffect(() => {
    initializeAIStore();
  }, [initializeAIStore]);

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input;
    setInput("");
    await sendCopilotQuery(query);
  };

  const handleSuggestionClick = async (text: string) => {
    if (isLoading) return;
    await sendCopilotQuery(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="flex h-[420px] w-[320px] sm:w-[350px] flex-col rounded-3xl border border-border bg-card shadow-glow overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
              <span className="text-xs font-bold">City Operations Copilot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={clearChat}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
                title="Clear Chat Logs"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] text-xs leading-relaxed p-3 rounded-2xl",
                  msg.sender === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary/45 text-foreground rounded-tl-none border border-border/40"
                )}
              >
                <p>{msg.text}</p>
                {msg.suggestedCommands && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1.5 border-t border-border/30">
                    {msg.suggestedCommands.map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => handleSuggestionClick(cmd)}
                        className="rounded-lg bg-card border border-border px-2 py-1 text-[9px] hover:bg-secondary text-primary font-medium transition-all"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex max-w-[80%] bg-secondary/45 text-foreground rounded-2xl rounded-tl-none border border-border/40 p-3 items-center gap-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Filter maps, search reports..."
              className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
export default AICopilot;
