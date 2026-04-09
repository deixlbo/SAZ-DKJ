import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { Shield, Mail, Phone, MapPin, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockOfficials } from "@/lib/mock-data";

export default function OfficialProfilePage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: userData?.fullName ?? "",
    email: userData?.email ?? "",
    phone: userData?.phone ?? "0912-345-6789",
    address: userData?.address ?? "Barangay Hall, Santiago",
  });

  const officialInfo = mockOfficials.find(o => o.email === userData?.email);

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile Updated", description: "Your profile has been updated." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="My Profile" description="Official account information" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-24 h-24 rounded-full bg-sidebar/10 border-4 border-sidebar/20 flex items-center justify-center shrink-0">
              <span className="text-4xl font-bold text-sidebar">{userData?.fullName?.charAt(0) ?? "O"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">{userData?.fullName}</h2>
              <p className="text-muted-foreground text-sm">{officialInfo?.position ?? "Barangay Official"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-sidebar/10 text-sidebar border border-sidebar/20">
                  <Shield className="w-3 h-3" /> Official
                </span>
                <span className="text-xs text-muted-foreground">Barangay Santiago Saz</span>
              </div>
            </div>
            {!editing && (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="shrink-0 border-primary/30 text-primary hover:bg-primary/5">
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="mt-1" data-testid="input-fullname" /></div>
              <div><Label>Official Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1" type="email" data-testid="input-email" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" data-testid="input-phone" /></div>
              <div><Label>Office Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="mt-1" data-testid="input-address" /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2" data-testid="button-save-profile">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <User className="w-4 h-4" />, label: "Full Name", value: userData?.fullName },
                { icon: <Shield className="w-4 h-4" />, label: "Position", value: officialInfo?.position ?? "Barangay Official" },
                { icon: <Mail className="w-4 h-4" />, label: "Official Email", value: userData?.email },
                { icon: <Phone className="w-4 h-4" />, label: "Phone", value: form.phone },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <span className="text-primary mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* All Officials */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Barangay Santiago Saz Officials</h3>
          <div className="space-y-3">
            {mockOfficials.map(o => (
              <div key={o.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{o.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{o.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{o.position}</p>
                </div>
                {o.email === userData?.email && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">You</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
