import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { useAuth } from "@/lib/auth-context";
import { mockAnnouncements } from "@/lib/mock-data";
import { Megaphone, Plus, X, Trash2, AlertTriangle, CalendarDays, List, Pencil, Check } from "lucide-react";
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

const priorityBadge: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const emptyForm = { title: "", content: "", category: "Event", priority: "medium" as Priority };

export default function OfficialAnnouncementsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements as Announcement[]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const markedDates = announcements.map(a => a.date);
  const getDateCount = (date: string) => announcements.filter(a => a.date === date).length;

  const displayed = selectedDate && view === "list"
    ? announcements.filter(a => a.date === selectedDate)
    : announcements;

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setForm({ title: ann.title, content: ann.content, category: ann.category, priority: ann.priority });
    setEditingId(ann.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      toast({ title: "Announcement Updated", description: "Changes saved successfully." });
    } else {
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
      toast({ title: "Announcement Posted", description: "Your announcement has been published." });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Announcement removed." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Announcements"
        description={`${announcements.length} announcements published`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={openCreate}>
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Post Announcement</span>
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Create/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editingId ? "Edit Announcement" : "Post Announcement"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="mt-1" required />
                </div>
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
                  <Label>Content</Label>
                  <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your announcement content..." className="mt-1 min-h-[150px]" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingId ? <><Check className="w-4 h-4 mr-1" /> Save Changes</> : "Post Announcement"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            <MiniCalendar
              markedDates={markedDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getDateCount={getDateCount}
            />
            <div className="space-y-3">
              {selectedDate ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedDate).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {" — "}<span className="text-muted-foreground">{announcements.filter(a => a.date === selectedDate).length} announcement(s)</span>
                  </p>
                  {announcements.filter(a => a.date === selectedDate).length === 0 ? (
                    <Card className="p-8 text-center">
                      <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No announcements on this date</p>
                    </Card>
                  ) : (
                    announcements.filter(a => a.date === selectedDate).map(ann => (
                      <Card key={ann.id} className="p-4 border-border/50">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                              <span className="text-xs text-muted-foreground">{ann.category}</span>
                            </div>
                            <h3 className="font-semibold text-foreground">{ann.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date to see announcements</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="space-y-3">
            {displayed.map(ann => (
              <Card key={ann.id} className="p-5 border-border/50 hover:border-primary/30 transition">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ann.priority === "high" ? "bg-red-100" : ann.priority === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                    {ann.priority === "high"
                      ? <AlertTriangle className="w-5 h-5 text-red-600" />
                      : <Megaphone className={`w-5 h-5 ${ann.priority === "medium" ? "text-amber-600" : "text-green-600"}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{ann.category}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{ann.author} · {new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
