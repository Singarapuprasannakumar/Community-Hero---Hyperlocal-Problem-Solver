import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, CheckCheck } from "lucide-react";
import { useMessagingStore } from "@/shared/stores/community-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MessagingBoard() {
  const { user } = useAuthStore();
  const { messages, sendMessage } = useMessagingStore();
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputText.trim()) return;

    sendMessage(user.id, user.name, inputText.trim());
    setInputText("");
    toast.success("Message dispatched.");
  };

  return (
    <div className="border border-border bg-card rounded-3xl overflow-hidden flex flex-col h-[480px] shadow-soft">
      {/* Active channel header */}
      <div className="bg-primary/5 border-b border-border p-4 flex items-center gap-2">
        <MessageSquare className="h-4.5 w-4.5 text-primary" />
        <span className="text-xs font-bold">#ward-80-coordination</span>
      </div>

      {/* Messages timeline logs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = user ? msg.senderId === user.id : false;
          return (
            <div key={msg.id} className={cn("flex flex-col max-w-[80%] text-xs", isMe ? "ml-auto items-end" : "items-start")}>
              <span className="text-[10px] text-muted-foreground mb-1">
                {msg.senderName} ({msg.senderRole})
              </span>
              <div className={cn(
                "p-3 rounded-2xl leading-relaxed",
                isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-secondary text-foreground rounded-tl-none border border-border/40"
              )}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground/80">
                <span>{new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                {isMe && <CheckCheck className="h-3 w-3 text-success" />}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send coordinates update or volunteer detail..."
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-glow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
export default MessagingBoard;
