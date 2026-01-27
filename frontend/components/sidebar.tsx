"use client"

import { X, MessageSquare, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getSessions, deleteSession, type Session, type StatsData, fetchStats } from "@/lib/search-api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean,
  onClose: () => void,
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionId = searchParams.get("id");

  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
    loadSessions();
  }, [])

  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data);
    setIsLoading(false);
  }


  const handleOpenDeleteDialog = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSessionId(id);
    setDeleteDialog(true);
  }

  const handleDelete = async () => {
    if (!sessionId) {
      toast.error("Error Deleting chat.", { description: "Something went wrong, Please try again." });
      return;
    }
    await deleteSession(sessionId);
    await loadSessions();
    if (currentSessionId === sessionId) {
      router.push("/chat");
    }
    setSessionId(null);
    setDeleteDialog(false);
    toast.success("Deleted", { description: "Chat deleted successfuly" });
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 border-r border-border/50 bg-background transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Archive Index</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="px-3 py-2.5 rounded-lg bg-muted/50">
                <div className="text-muted-foreground">Entries</div>
                <div className="font-semibold text-foreground">
                  {stats ? stats.entries.value : <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
              </div>
              <div className="px-3 py-2.5 rounded-lg bg-muted/50">
                <div className="text-muted-foreground">Pages</div>
                <div className="font-semibold text-foreground">
                  {stats ? stats.pages.value : <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
              </div>
            </div>

            <Link href="/chat" onClick={onClose}>
              <Button className="w-full justify-start gap-2 hover:bg-primary hover:text-primary-foreground cursor-pointer" variant={!currentSessionId ? "secondary" : "outline"}>
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-2">
                  History
                </h3>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-2">No previous chats</p>
                ) : (
                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <Link 
                        key={session.id} 
                        href={`/chat?id=${session.id}`}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors overflow-hidden",
                          currentSessionId === session.id 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                        <span className="flex-1 truncate">{session.title || "Untitled Chat"}</span>
                        
                        <Button
                          size={"icon-sm"}
                          variant={"ghost"}
                          onClick={(e) => handleOpenDeleteDialog(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all cursor-pointer"
                          title="Delete chat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">Preservation Status</span>
                <span className="text-xs font-semibold text-secondary">99.9%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[99.9%] bg-linear-to-r from-secondary to-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent>
            <DialogHeader>
                  <DialogTitle>Delete this chat?</DialogTitle>

                <DialogDescription>
                    Are i sure u want to delete this chat?
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setDeleteDialog(false)}
                    // disabled={loading}
                >
                    cancel
                </Button>

                <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleDelete}
                    // disabled={loading}
                >
                    Delete
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </aside>
    </>
  )
}
