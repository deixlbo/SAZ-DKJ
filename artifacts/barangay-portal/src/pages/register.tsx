import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, UserPlus, CheckCircle2, Upload, X, Eye, EyeOff, AlertCircle
} from "lucide-react";

const PUROKS = [
  "Purok 1 - Saranay", "Purok 2 - Kaunlaran", "Purok 3 - Bonifacio",
  "Purok 4 - Pagkakaisa", "Purok 5 - Maligaya", "Purok 6 - Masagana",
];

const VALID_ID_TYPES = [
  "National ID (PhilSys)",
  "Driver's License",
  "Passport",
  "Voter's ID",
  "SSS / GSIS ID",
  "Postal ID",
  "Senior Citizen ID",
];

type Step = "form" | "success";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    purok: PUROKS[0],
    barangay: "Barangay Santiago Saz",
    validIdType: VALID_ID_TYPES[0],
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!/^09\d{9}$/.test(form.phone)) e.phone = "Phone must be 11 digits starting with 09";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!idFile) e.idFile = "Please upload a valid ID";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    await new Promise(r => setTimeout(r, 1500));

    // Save pending registration to localStorage
    const pending = JSON.parse(localStorage.getItem("pending_registrations") ?? "[]");
    pending.push({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      purok: form.purok,
      barangay: form.barangay,
      validIdType: form.validIdType,
      submittedAt: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem("pending_registrations", JSON.stringify(pending));

    setLoading(false);
    setStep("success");
  };

  const setField = (k: string, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeUp">
          <Card className="p-8 text-center shadow-xl border-primary/20">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Registration Submitted!</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your registration is currently under review by the barangay officials.
              Please wait for approval before logging in.
            </p>

            {/* Simulated email preview */}
            <div className="text-left bg-muted/50 rounded-xl border border-border p-4 mb-6 text-sm">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Email sent to: {form.email}</p>
              <div className="border-t border-border pt-3 space-y-2 text-foreground/80 text-xs leading-relaxed">
                <p>Dear <strong className="text-foreground">{form.fullName}</strong>,</p>
                <p>Thank you for registering.</p>
                <p>Your account is currently under review by the barangay officials. Please wait for approval before logging in.</p>
                <p>You will receive another email once your account has been approved.</p>
                <p className="pt-1">Thank you.</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 mb-6 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>You will not be able to login until your account has been approved by a barangay official.</span>
            </div>

            <Button onClick={() => setLocation("/login/resident")} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fadeUp py-8">
        <Link href="/login/resident">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </Link>

        <Card className="p-8 border-primary/20 shadow-xl">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Create Resident Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Barangay Santiago Saz · San Antonio, Zambales</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.fullName}
                onChange={e => setField("fullName", e.target.value)}
                placeholder="Juan dela Cruz"
                className={`mt-1 ${errors.fullName ? "border-destructive" : ""}`}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-0.5">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <Label>Email Address <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder="juan@email.com"
                className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="text-xs text-destructive mt-0.5">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone Number <span className="text-destructive">*</span></Label>
              <Input
                value={form.phone}
                onChange={e => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="09XXXXXXXXX (11 digits)"
                className={`mt-1 ${errors.phone ? "border-destructive" : ""}`}
              />
              {errors.phone && <p className="text-xs text-destructive mt-0.5">{errors.phone}</p>}
              <p className="text-xs text-muted-foreground mt-0.5">{form.phone.length}/11 digits</p>
            </div>

            {/* Address */}
            <div>
              <Label>House/Street Address <span className="text-destructive">*</span></Label>
              <Input
                value={form.address}
                onChange={e => setField("address", e.target.value)}
                placeholder="House no., Street name"
                className={`mt-1 ${errors.address ? "border-destructive" : ""}`}
              />
              {errors.address && <p className="text-xs text-destructive mt-0.5">{errors.address}</p>}
            </div>

            {/* Purok + Barangay */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Purok <span className="text-destructive">*</span></Label>
                <select
                  value={form.purok}
                  onChange={e => setField("purok", e.target.value)}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {PUROKS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <Label>Barangay</Label>
                <Input value={form.barangay} readOnly className="mt-1 bg-muted text-muted-foreground" />
              </div>
            </div>

            {/* Valid ID Type */}
            <div>
              <Label>Valid ID Type <span className="text-destructive">*</span></Label>
              <select
                value={form.validIdType}
                onChange={e => setField("validIdType", e.target.value)}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {VALID_ID_TYPES.map(id => <option key={id} value={id}>{id}</option>)}
              </select>
            </div>

            {/* Upload Valid ID */}
            <div>
              <Label>Upload Valid ID <span className="text-destructive">*</span></Label>
              <div
                className={`mt-1 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all hover:border-primary/40 hover:bg-primary/5 ${errors.idFile ? "border-destructive" : "border-border"} ${idFile ? "border-emerald-300 bg-emerald-50" : ""}`}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0] ?? null;
                    setIdFile(f);
                    if (f && errors.idFile) setErrors(p => { const n = { ...p }; delete n.idFile; return n; });
                  }}
                />
                {idFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700">{idFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(idFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setIdFile(null); }}
                      className="text-muted-foreground hover:text-destructive ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload ID photo or PDF</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">JPG, PNG, PDF — max 5MB</p>
                  </div>
                )}
              </div>
              {errors.idFile && <p className="text-xs text-destructive mt-0.5">{errors.idFile}</p>}
            </div>

            {/* Password */}
            <div>
              <Label>Password <span className="text-destructive">*</span></Label>
              <div className="relative mt-1">
                <Input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setField("password", e.target.value)}
                  placeholder="At least 8 characters"
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-0.5">{errors.password}</p>}
            </div>

            <div>
              <Label>Confirm Password <span className="text-destructive">*</span></Label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={e => setField("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                className={`mt-1 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-0.5">{errors.confirmPassword}</p>}
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-muted-foreground">
              By registering, you agree that the information you provided is truthful and accurate.
              Providing false information is a violation of barangay regulations.
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Submit Registration</span>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/login/resident">
              <button className="text-sm text-muted-foreground hover:text-foreground transition">
                Already have an account? Sign in
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
