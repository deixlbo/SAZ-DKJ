import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, Platform, ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

type DocStatus = "approved" | "pending" | "processing" | "rejected";

interface DocRequest {
  id: string;
  type: string;
  purpose: string;
  status: DocStatus;
  date: string;
}

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Certificate of Good Moral Character",
  "Barangay ID",
];

const initialDocs: DocRequest[] = [
  { id: "doc-001", type: "Barangay Clearance", purpose: "Job application", status: "approved", date: "2026-04-01" },
];

const officialDocs: DocRequest[] = [
  { id: "doc-001", type: "Barangay Clearance", purpose: "Job application", status: "approved", date: "2026-04-01" },
  { id: "doc-002", type: "Certificate of Indigency", purpose: "PhilHealth application", status: "pending", date: "2026-04-05" },
  { id: "doc-003", type: "Certificate of Residency", purpose: "School enrollment", status: "processing", date: "2026-04-07" },
  { id: "doc-004", type: "Business Permit", purpose: "Sari-sari store renewal", status: "rejected", date: "2026-03-28" },
];

const statusConfig: Record<DocStatus, { color: string; icon: string; bg: string }> = {
  approved: { color: "#16A34A", icon: "checkmark-circle", bg: "#dcfce7" },
  pending: { color: "#ca8a04", icon: "time", bg: "#fef9c3" },
  processing: { color: "#2563eb", icon: "sync-circle", bg: "#dbeafe" },
  rejected: { color: "#dc2626", icon: "close-circle", bg: "#fee2e2" },
};

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function DocumentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isOfficial = user?.role === "official";

  const [docs, setDocs] = useState<DocRequest[]>(isOfficial ? officialDocs : initialDocs);
  const [showModal, setShowModal] = useState(false);
  const [docType, setDocType] = useState(documentTypes[0]);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSubmit = async () => {
    if (!purpose.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newDoc: DocRequest = {
      id: `doc-${Date.now()}`,
      type: docType,
      purpose,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setDocs(prev => [newDoc, ...prev]);
    setPurpose("");
    setShowModal(false);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: DocStatus) => {
    setUpdating(id);
    await new Promise(r => setTimeout(r, 600));
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    setUpdating(null);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.sidebar,
      paddingTop: topPad + 12,
      paddingBottom: 20,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    headerTitle: {
      color: colors.sidebarForeground,
      fontFamily: "Inter_700Bold",
      fontSize: 24,
    },
    headerSub: {
      color: "rgba(240,253,244,0.6)",
      fontFamily: "Inter_400Regular",
      fontSize: 13,
    },
    addBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    addBtnText: {
      color: "#fff",
      fontFamily: "Inter_600SemiBold",
      fontSize: 13,
    },
    content: { padding: 16, gap: 10 },
    docCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    docRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    docIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    docTitle: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 14,
      color: colors.foreground,
    },
    docPurpose: {
      fontFamily: "Inter_400Regular",
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginTop: 8,
    },
    statusText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 11,
      textTransform: "capitalize",
    },
    actionRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionBtn: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 6,
      alignItems: "center",
    },
    actionBtnText: {
      fontFamily: "Inter_600SemiBold",
      fontSize: 12,
    },
    empty: {
      alignItems: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontFamily: "Inter_400Regular",
      fontSize: 15,
      color: colors.mutedForeground,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Documents</Text>
          <Text style={s.headerSub}>{isOfficial ? "Manage all requests" : "Your requests"}</Text>
        </View>
        {!isOfficial && (
          <TouchableOpacity style={s.addBtn} onPress={() => setShowModal(true)} testID="button-new-request">
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.addBtnText}>Request</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {docs.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.mutedForeground + "60"} />
            <Text style={s.emptyText}>No document requests yet</Text>
            {!isOfficial && (
              <TouchableOpacity style={[s.addBtn, { paddingHorizontal: 20 }]} onPress={() => setShowModal(true)}>
                <Text style={s.addBtnText}>Request a Document</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          docs.map(doc => {
            const cfg = statusConfig[doc.status];
            return (
              <View key={doc.id} style={s.docCard}>
                <View style={s.docRow}>
                  <View style={s.docIconWrap}>
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.docTitle}>{doc.type}</Text>
                    <Text style={s.docPurpose}>Purpose: {doc.purpose}</Text>
                    <Text style={s.docPurpose}>{new Date(doc.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</Text>
                    <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon as IoniconsName} size={12} color={cfg.color} />
                      <Text style={[s.statusText, { color: cfg.color }]}>{doc.status}</Text>
                    </View>
                  </View>
                </View>
                {isOfficial && doc.status !== "approved" && doc.status !== "rejected" && (
                  <View style={s.actionRow}>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: "#dcfce7" }]}
                      onPress={() => handleUpdateStatus(doc.id, "approved")}
                    >
                      {updating === doc.id ? <ActivityIndicator size="small" color={colors.primary} /> : <Text style={[s.actionBtnText, { color: colors.primary }]}>Approve</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: "#fee2e2" }]}
                      onPress={() => handleUpdateStatus(doc.id, "rejected")}
                    >
                      <Text style={[s.actionBtnText, { color: "#dc2626" }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Request Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: colors.foreground }}>New Document Request</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>Document Type</Text>
          <View style={{ backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: "hidden" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 6 }}>
              {documentTypes.map(dt => (
                <TouchableOpacity
                  key={dt}
                  onPress={() => setDocType(dt)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: colors.radius,
                    marginRight: 6,
                    backgroundColor: docType === dt ? colors.primary : colors.muted,
                  }}
                >
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: docType === dt ? "#fff" : colors.mutedForeground }}>{dt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.foreground, marginBottom: 6 }}>Purpose</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="e.g., Job application, School enrollment..."
            placeholderTextColor={colors.mutedForeground}
            style={{
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: colors.foreground,
              marginBottom: 24,
            }}
            multiline
            numberOfLines={3}
            testID="input-purpose"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !purpose.trim()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: colors.radius,
              paddingVertical: 15,
              alignItems: "center",
              opacity: loading || !purpose.trim() ? 0.6 : 1,
            }}
            testID="button-submit-request"
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 16 }}>Submit Request</Text>
            }
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
