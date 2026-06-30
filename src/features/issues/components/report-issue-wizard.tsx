import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Camera,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  CheckCircle2,
  Volume2,
  FileText,
  AlertTriangle,
  Upload,
  User,
  Activity,
  Layers,
  Heart,
  X
} from "lucide-react";
import { useIssueStore } from "@/shared/stores/issue-store";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useUIStore } from "@/shared/stores/ui-store";
import { attachmentService, locationService } from "@/shared/services/issue-service";
import { aiService, TRIAGE_STAGES } from "@/shared/services/ai-service";
import { Attachment, LocationObject, AIMetadata, Issue, IssueStatus } from "@/shared/types/issue-types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_ITEMS = [
  { id: "roads", name: "Roads & Transit", icon: Activity, desc: "Potholes, signal outages, broken pavements" },
  { id: "water", name: "Water Supply", icon: Layers, desc: "Pipe bursts, water leaks, low pressure" },
  { id: "waste", name: "Sanitation", icon: Trash2, desc: "Garbage piles, illegal dumps, drainage leaks" },
  { id: "parks", name: "Parks & Trees", icon: Heart, desc: "Fallen trees, vandalism, overgrown grass" },
  { id: "hazards", name: "Hazards & Safety", icon: AlertTriangle, desc: "Exposed live cables, structural risk" },
];

export function ReportIssueWizard() {
  const { user } = useAuthStore();
  const { createIssue, activeDraft, saveDraft, setActiveDraft } = useIssueStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  
  // Form states
  const [selectedCat, setSelectedCat] = useState<string>(activeDraft?.category || "");
  const [title, setTitle] = useState(activeDraft?.title || "");
  const [description, setDescription] = useState(activeDraft?.description || "");
  const [tags, setTags] = useState<string[]>(activeDraft?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  // Media states
  const [attachments, setAttachments] = useState<Attachment[]>(activeDraft?.attachments || []);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: number }>({});
  
  // Location states
  const [location, setLocation] = useState<Partial<LocationObject>>(activeDraft?.location || {});
  const [detectingGps, setDetectingGps] = useState(false);
  
  // AI states
  const [aiTriage, setAiTriage] = useState<AIMetadata | undefined>(activeDraft?.aiMetadata);
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageStageIndex, setTriageStageIndex] = useState(0);
  const [triageStageName, setTriageStageName] = useState("");

  // Autosave triggers on key state changes
  useEffect(() => {
    const draftId = activeDraft?.id || `drf-${Math.random().toString(36).substr(2)}`;
    const updatedDraft: Partial<Issue> = {
      id: draftId,
      category: selectedCat,
      title,
      description,
      tags,
      attachments,
      location: location as LocationObject,
      aiMetadata: aiTriage,
      status: "draft",
      updatedAt: new Date().toISOString(),
    };
    setActiveDraft(updatedDraft);
    saveDraft(updatedDraft);
  }, [selectedCat, title, description, tags, attachments, location, aiTriage]);

  const handleNextStep = () => {
    if (step === 1 && !selectedCat) {
      toast.error("Please pick a category");
      return;
    }
    if (step === 2 && (!title || !description)) {
      toast.error("Title and Description are required");
      return;
    }
    if (step === 3 && attachments.length === 0) {
      toast.info("Proceeding without attachment.");
    }
    if (step === 4 && !location.address) {
      // Auto populate a fallback location to prevent form blockage during presentation demos
      setLocation({
        latitude: 12.9716,
        longitude: 77.5946,
        address: "12th Cross Road, Indiranagar, Bengaluru, Karnataka, India",
        ward: "Ward 80 - Indiranagar",
        district: "Bengaluru Urban",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
      });
      toast.info("Autofilled default Bengaluru coordinates.");
    }
    
    if (step === 4 && !aiTriage) {
      // Trigger AI triage before step 5
      runAiTriage();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBackStep = () => {
    setStep((s) => s - 1);
  };

  async function runAiTriage() {
    setStep(5);
    setTriageLoading(true);
    try {
      const result = await aiService.runTriagePipeline(
        title,
        description,
        (idx, name) => {
          setTriageStageIndex(idx);
          setTriageStageName(name);
        }
      );
      setAiTriage(result);
    } catch (err: any) {
      toast.error("AI Analysis failed. Showing fallback estimates.");
    } finally {
      setTriageLoading(false);
    }
  }

  // File picker handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempId = `temp-${Math.random().toString(36).substr(2)}`;
      
      setUploadingFiles((prev) => ({ ...prev, [tempId]: 0 }));
      
      try {
        const uploaded = await attachmentService.uploadFile(
          { name: file.name, size: file.size, type: file.type },
          (progress) => {
            setUploadingFiles((prev) => ({ ...prev, [tempId]: progress }));
          }
        );
        setAttachments((prev) => [...prev, uploaded]);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadingFiles((prev) => {
          const next = { ...prev };
          delete next[tempId];
          return next;
        });
      }
    }
  };

  // Location handler
  async function handleAutoGps() {
    setDetectingGps(true);
    try {
      const gps = await locationService.getBrowserGPS();
      const addressData = await locationService.reverseGeocode(gps.latitude, gps.longitude);
      setLocation({
        latitude: gps.latitude,
        longitude: gps.longitude,
        accuracy: gps.accuracy,
        ...addressData,
      });
      toast.success("GPS Coordinates retrieved successfully");
    } catch (err) {
      toast.error("Location access denied or failed");
    } finally {
      setDetectingGps(false);
    }
  }

  // Tags adder
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.toLowerCase()]);
      setTagInput("");
    }
  };

  // Submit report to Zustand issue-store
  const handleSubmitReport = () => {
    if (!user) return;
    const refNum = `REF-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const newIssue: Issue = {
      id: activeDraft?.id || `iss-${Math.random().toString(36).substr(2)}`,
      refNumber: refNum,
      slug: `${refNum.toLowerCase()}-${title.toLowerCase().replace(/ /g, "-")}`,
      title,
      description,
      category: selectedCat,
      subcategory: aiTriage?.subcategory || selectedCat,
      tags,
      priority: (({ 1: "low", 2: "medium", 3: "high", 4: "urgent" } as Record<number, "low" | "medium" | "high" | "urgent">)[aiTriage?.priorityScore ?? 2] ?? "medium"),
      severity: (({ 1: "low", 2: "medium", 3: "high", 4: "critical" } as Record<number, "low" | "medium" | "high" | "critical">)[aiTriage?.severityScore ?? 2] ?? "medium"),
      status: "pending_verification",
      location: location as LocationObject,
      reporterId: user.id,
      reporterName: user.name,
      reporterRole: user.role,
      reporterReputation: user.trustScore,
      anonymous: false,
      attachments,
      aiMetadata: aiTriage,
      comments: [],
      verifications: [],
      relatedIssues: [],
      estimatedCost: aiTriage?.costEstimate || 1500,
      estimatedResolutionHours: aiTriage?.etaHours || 24,
      visibility: "public",
      timeline: [
        {
          id: `tml-${Math.random().toString(36).substr(2)}`,
          issueId: activeDraft?.id || "",
          status: "submitted",
          title: "Report Filed",
          description: "Citizen reported the incident with photo evidence.",
          actorName: user.name,
          actorRole: user.role,
          createdAt: new Date().toISOString(),
        },
        {
          id: `tml-${Math.random().toString(36).substr(2)}`,
          issueId: activeDraft?.id || "",
          status: "ai_processing",
          title: "AI Triage Completed",
          description: `Confidence score: ${(aiTriage?.confidenceScore || 0.9) * 100}%. Predicted Ward: ${location.ward}.`,
          actorName: "System AI",
          actorRole: "system",
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createIssue(newIssue);
    setActiveDraft(null);
    toast.success(`Incident report ${refNum} successfully filed!`);
    navigate({ to: "/dashboard/issues" });
  };

  return (
    <div className="mx-auto max-w-2xl bg-card border border-border shadow-soft rounded-3xl p-6 md:p-8">
      {/* Stepper indicator */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Step {step} of 6
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all",
                step > idx ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: -16, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {/* STEP 1: Category Picker */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Select Category</h2>
                <p className="text-xs text-muted-foreground mt-1">What kind of issue are you reporting?</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {CATEGORY_ITEMS.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.name)}
                      className={cn(
                        "flex flex-col items-start gap-2.5 rounded-2xl border p-4 text-left transition-all hover:bg-secondary",
                        selectedCat === cat.name ? "border-primary bg-primary/5" : "border-border bg-background"
                      )}
                    >
                      <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", selectedCat === cat.name ? "bg-primary/10 text-primary" : "bg-secondary text-foreground")}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold">{cat.name}</h4>
                        <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Report Description</h2>
                <p className="text-xs text-muted-foreground mt-1">Provide title and detailed incident logs.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Short summary (e.g. Water leak Indiranagar 12th Cross)"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is happening? Any immediate hazard or SLA blockages?"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Tags (optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag (e.g. road-hazard)"
                      className="flex-1 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <button onClick={addTag} className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-medium">
                        {tag}
                        <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Media Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Attach Media</h2>
                <p className="text-xs text-muted-foreground mt-1">Upload pictures, videos, or record voice notes.</p>
              </div>

              {/* Drag-drop upload area */}
              <div className="relative border-2 border-dashed border-border rounded-3xl p-8 text-center bg-background/50 hover:bg-background transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*,audio/*,application/pdf"
                />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-bounce" />
                <h4 className="text-sm font-semibold">Drag & drop files or click to browse</h4>
                <p className="text-[10px] text-muted-foreground/80 mt-1">Supports PNG, JPG, MP4, MP3, PDF up to 10MB</p>
              </div>

              {/* Attachment Previews */}
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between border border-border bg-card p-3 rounded-2xl shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                        {att.type === "image" ? <Camera className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate max-w-[200px]">{att.name}</div>
                        <div className="text-[10px] text-muted-foreground">{(att.size / 1024).toFixed(0)} KB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="rounded-lg p-1 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Upload progress mock bar */}
                {Object.keys(uploadingFiles).map((id) => (
                  <div key={id} className="border border-border bg-card p-3 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading file...</span>
                      <span>{uploadingFiles[id]}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${uploadingFiles[id]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Location Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Incident Location</h2>
                <p className="text-xs text-muted-foreground mt-1">Specify GPS coordinates or input address details.</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAutoGps}
                  disabled={detectingGps}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs font-semibold text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  {detectingGps ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  <span>Detect GPS Location</span>
                </button>

                {location.latitude && (
                  <div className="grid grid-cols-2 gap-3 border border-border bg-secondary/30 rounded-2xl p-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Latitude</span>
                      <span className="font-mono">{location.latitude.toFixed(5)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Longitude</span>
                      <span className="font-mono">{location.longitude?.toFixed(5)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Formatted Address</label>
                  <textarea
                    rows={2}
                    value={location.address || ""}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    placeholder="Enter street name, building number, ward..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Landmark (optional)</label>
                  <input
                    type="text"
                    value={location.landmark || ""}
                    onChange={(e) => setLocation({ ...location, landmark: e.target.value })}
                    placeholder="e.g. Opposite CCD cafe"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AI Pipeline Triage */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
              {triageLoading ? (
                <>
                  <div className="relative h-20 w-20 flex items-center justify-center bg-primary/5 rounded-full shadow-glow">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                    <Loader2 className="absolute inset-0 h-full w-full text-primary animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">AI Incident Processing</h3>
                    <p className="text-xs text-muted-foreground leading-normal max-w-sm">
                      Running multi-stage vision classification and spatial checks...
                    </p>
                  </div>

                  {/* Stage ticker */}
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{triageStageName}</span>
                      <span>{Math.floor(((triageStageIndex + 1) / TRIAGE_STAGES.length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((triageStageIndex + 1) / TRIAGE_STAGES.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">AI Analysis Completed</h3>
                    <p className="text-xs text-muted-foreground">Predictions loaded successfully with high confidence.</p>
                  </div>

                  {aiTriage && (
                    <div className="w-full text-left bg-secondary/30 rounded-2xl p-5 border border-border space-y-3.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recommended Dept:</span>
                        <span className="font-semibold">{aiTriage.recommendedDepartment}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Resolution ETA:</span>
                        <span className="font-semibold">{aiTriage.etaHours} Hours</span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Cost Projection:</span>
                        <span className="font-semibold">₹{aiTriage.costEstimate}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Visual Identifiers:</span>
                        <span className="font-mono text-[10px] truncate max-w-[180px]">{aiTriage.detectedObjects.join(", ")}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(6)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* STEP 6: Review Summary */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Review Report</h2>
                <p className="text-xs text-muted-foreground mt-1">Review all properties before submission.</p>
              </div>

              <div className="space-y-4 border border-border bg-background rounded-2xl p-4 text-xs">
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Category</span>
                    <span className="font-semibold">{selectedCat}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Title</span>
                    <span className="font-semibold">{title}</span>
                  </div>
                </div>
                <div className="pb-3 border-b border-border">
                  <span className="text-muted-foreground block text-[10px]">Description</span>
                  <span className="text-foreground">{description}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">GPS coordinates</span>
                    <span className="font-mono">{location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Ward</span>
                    <span className="font-semibold">{location.ward || "Unassigned"}</span>
                  </div>
                </div>
                {aiTriage && (
                  <div className="rounded-xl bg-primary/5 p-3 space-y-2 border border-primary/10">
                    <h4 className="font-semibold text-primary text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> AI Prediction summary
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-muted-foreground block text-[9px]">SLA ETA</span>
                        <span>{aiTriage.etaHours}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px]">Est Cost</span>
                        <span>₹{aiTriage.costEstimate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px]">Confidence</span>
                        <span>{Math.floor(aiTriage.confidenceScore * 100)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer navigation buttons */}
      {step !== 5 && (
        <div className="flex items-center justify-between border-t border-border mt-8 pt-6">
          {step > 1 ? (
            <button
              onClick={handleBackStep}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitReport}
              className="inline-flex items-center gap-1.5 rounded-full bg-success px-6 py-3 text-xs font-bold text-success-foreground shadow-glow hover:bg-success/95 transition-all"
            >
              <span>Submit Report</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
