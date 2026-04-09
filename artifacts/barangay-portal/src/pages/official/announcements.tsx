import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { mockAnnouncements } from "@/lib/mock-data";
import { Megaphone, Plus, X, Trash2, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Priority = "high" | "medium" | "low";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: Priority;
  date: string;
  author: string;
}

export default function OfficialAnnouncementsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements as Announcement[]);
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", content: "", category: "Event", priority: "medium" as Priority,
  });

  const priorityBadge: Record<Priority, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: form.title,
      content: form.content,
      category: form.category,
      priority: form.priority,
      date: new Date().toISOString().split("T")[0],
      author: userData?.fullName ?? "Barangay Official",
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setShowForm(false);
    setForm({ title: "", content: "", category: "Event", priority: "medium" });
    toast({ title: "Announcement Posted", description: "Your announcement has been published." });
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Announcement removed." });
  };

  const handleAiWrite = async () => {
    if (!form.title.trim()) {
      toast({ title: "Add a title first", description: "Enter the announcement title to generate content.", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setAiLoading(false);
    const generated = `The Barangay Santiago Saz invites all residents to ${form.title.toLowerCase().replace("!", "")}.

${form.category === "Event" ? "All residents are encouraged to attend and participate in this community event." : "Please be informed and take the necessary precautions."}

For more information, please contact the Barangay Hall during office hours (Monday to Friday, 8:00 AM to 5:00 PM) or call 0912-345-6789.

Thank you for your continued support and cooperation.

– Barangay Santiago Saz Administration`;
    setForm(p => ({ ...p, content: generated }));
    toast({ title: "Content Generated", description: "AI has written the announcement content for you." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Announcements"
        description={`${announcements.length} announcements published`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-post-announcement">
            <Plus className="w-4 h-4" /> Post Announcement
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Post Announcement</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="mt-1" required data-testid="input-title" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Event", "Meeting", "Maintenance", "Warning", "General"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="high">High (Urgent)</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Content</Label>
                    <Button type="button" size="sm" variant="outline" onClick={handleAiWrite} disabled={aiLoading} className="h-7 text-xs gap-1 border-purple-300 text-purple-700 hover:bg-purple-50" data-testid="button-ai-write">
                      <Sparkles className="w-3 h-3" /> {aiLoading ? "Generating..." : "AI Write"}
                    </Button>
                  </div>
                  <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Type or use AI Write to generate content..." className="min-h-[150px]" required data-testid="input-content" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-announcement">Post Announcement</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        <div className="space-y-3">
          {announcements.map(ann => (
            <Card key={ann.id} className="p-5 border-border/50 hover:border-primary/30 transition" data-testid={`announcement-item-${ann.id}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ann.priority === "high" ? "bg-red-100" : ann.priority === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                  {ann.priority === "high"
                    ? <AlertTriangle className="w-5 h-5 text-red-600" />
                    : <Megaphone className={`w-5 h-5 ${ann.priority === "medium" ? "text-amber-600" : "text-green-600"}`} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">{ann.category}</Badge>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{ann.author} · {new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition shrink-0" data-testid={`button-delete-${ann.id}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
