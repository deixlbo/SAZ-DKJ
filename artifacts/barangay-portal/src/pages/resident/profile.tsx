import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { User, Phone, MapPin, Mail, Save, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResidentProfilePage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: userData?.fullName ?? "",
    email: userData?.email ?? "",
    phone: userData?.phone ?? "",
    address: userData?.address ?? "",
  });

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="My Profile" description="Manage your personal information" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-5">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-primary">{userData?.fullName?.charAt(0) ?? "R"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">{userData?.fullName}</h2>
              <p className="text-muted-foreground text-sm">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Shield className="w-3 h-3" /> Resident
                </span>
                <span className="text-xs text-muted-foreground">ID: {userData?.uid}</span>
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
              <div>
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="mt-1" data-testid="input-fullname" />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1" type="email" data-testid="input-email" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" placeholder="09XXXXXXXXX" data-testid="input-phone" />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="mt-1" data-testid="input-address" />
              </div>
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
                { icon: <Mail className="w-4 h-4" />, label: "Email", value: userData?.email },
                { icon: <Phone className="w-4 h-4" />, label: "Phone", value: userData?.phone ?? "Not provided" },
                { icon: <MapPin className="w-4 h-4" />, label: "Address", value: userData?.address ?? "Not provided" },
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

        {/* Important Notices */}
        <Card className="p-5 border-primary/20 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-3">Resident Information</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Your profile information is used for document requests and official communications.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Ensure your address matches your barangay record for proper document processing.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              For major updates (name change, etc.), visit the barangay hall with valid ID.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
