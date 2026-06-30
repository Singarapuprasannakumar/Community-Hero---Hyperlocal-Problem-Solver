export const heroStats = [
  { label: "Total issues", value: 2_847_392, suffix: "" },
  { label: "Resolved", value: 2_613_104, suffix: "" },
  { label: "Active citizens", value: 1_240_000, suffix: "+" },
  { label: "Partner departments", value: 312, suffix: "" },
  { label: "Trees saved", value: 84_500, suffix: "" },
  { label: "Water saved (M L)", value: 12.4, suffix: "", decimals: 1 },
] as const;

export const partners = [
  "City of Bengaluru",
  "Smart Pune",
  "GHMC",
  "UN-Habitat",
  "BMC",
  "Surat Smart City",
  "NDMC",
];

export const aiPipeline = [
  { step: "Detect", desc: "Vision models locate the incident in the photo." },
  { step: "Classify", desc: "Routes into 38 categories from pothole to flood." },
  { step: "Score", desc: "Severity, risk, and citizen impact scoring." },
  { step: "Match", desc: "Predicts the right department & SLA window." },
  { step: "Cluster", desc: "Merges duplicates within 250 m & 24 h." },
  { step: "Track", desc: "Closes the loop with the citizen in real time." },
] as const;

export const testimonials = [
  { name: "Aarti Mehra", role: "Ward Officer, BMC", quote: "We close 4x more tickets in half the time. The AI triage alone changed our week." },
  { name: "Rohit Khanna", role: "CIO, Smart Pune", quote: "Finally a citizen platform that feels like Linear, not a 2010 government portal." },
  { name: "Dr. Sana Iqbal", role: "Urban Researcher, UN-Habitat", quote: "Their duplicate clustering is the cleanest implementation I've audited." },
  { name: "Vivek Nair", role: "Volunteer Lead", quote: "I onboarded 200 volunteers in a weekend. The gamification just works." },
  { name: "Meera Joshi", role: "Mayor's Office", quote: "Transparency dashboards we can actually publish. Citizens trust the data." },
];

export const liveFeed = [
  { city: "Bengaluru", issue: "Pothole on 100ft Road", severity: "high" },
  { city: "Pune", issue: "Streetlight outage cluster", severity: "med" },
  { city: "Mumbai", issue: "Water leakage, Andheri", severity: "high" },
  { city: "Hyderabad", issue: "Illegal dumping near park", severity: "med" },
  { city: "Delhi", issue: "Tree fallen after storm", severity: "high" },
  { city: "Surat", issue: "Graffiti on transit hub", severity: "low" },
  { city: "Chennai", issue: "Flooding alert, T. Nagar", severity: "high" },
  { city: "Ahmedabad", issue: "Noise complaint, Bopal", severity: "low" },
] as const;

export type Severity = "high" | "med" | "low";