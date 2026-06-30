import { Issue, IssueStatus, IssuePriority, IssueSeverity, LocationObject, Attachment, IssueComment, VerificationVote, TimelineEvent } from "../types/issue-types";
import { UserRole } from "../types/user-types";

const CATEGORIES = [
  { name: "Roads", subs: ["Pothole", "Broken Sidewalk"] },
  { name: "Water", subs: ["Water Leakage", "Pipe Burst", "Contamination", "No Supply"] },
  { name: "Streetlights", subs: ["Streetlight Outage", "Dim Light"] },
  { name: "Garbage", subs: ["Garbage Pile", "Illegal Dumping"] },
  { name: "Drainage", subs: ["Blocked Drain", "Manhole Overflow"] },
  { name: "Traffic", subs: ["Signal Failure", "Signage Missing"] },
  { name: "Electricity", subs: ["Exposed Wires", "Power Outage"] },
  { name: "Public Safety", subs: ["Structural Hazard", "Fallen Tree"] },
  { name: "Other", subs: ["Noise Complaint", "Vandalism"] },
];

const WARDS = [
  "Ward 42 - Vasanth Nagar",
  "Ward 80 - Indiranagar",
  "Ward 150 - Bellandur",
  "Ward 93 - Jayanagar",
  "Ward 18 - Koramangala",
  "Ward 11 - Whitefield",
  "Ward 72 - Malleshwaram",
  "Ward 5 - Hebbal",
];

const DEPARTMENTS = [
  "BBMP - Roads",
  "BBMP - Forest Department",
  "BWSSB - Water Operations",
  "BESCOM - Power Grid",
  "KSP - Safety & Traffic",
  "BBMP - Waste Management",
];

const OFFICERS = [
  { id: "off-1", name: "Aarti Mehra", role: "officer" as UserRole, dept: "BBMP - Roads" },
  { id: "off-2", name: "Ramesh Kumar", role: "officer" as UserRole, dept: "BWSSB - Water Operations" },
  { id: "off-3", name: "Sunil Gowda", role: "officer" as UserRole, dept: "BESCOM - Power Grid" },
  { id: "off-4", name: "Priya Rao", role: "officer" as UserRole, dept: "BBMP - Waste Management" },
];

const CITIZENS = [
  { id: "cit-1", name: "Ananya Sharma", role: "citizen" as UserRole, reputation: 82 },
  { id: "cit-2", name: "Karan Patel", role: "citizen" as UserRole, reputation: 65 },
  { id: "cit-3", name: "Rohan Das", role: "citizen" as UserRole, reputation: 90 },
  { id: "cit-4", name: "Meera Joshi", role: "citizen" as UserRole, reputation: 74 },
  { id: "cit-5", name: "Amit Kumar", role: "citizen" as UserRole, reputation: 45 },
];

const VOLUNTEERS = Array.from({ length: 50 }).map((_, i) => ({
  id: `vol-${i}`,
  name: `Volunteer ${i + 1}`,
  role: "volunteer" as UserRole,
  reputation: Math.floor(Math.random() * 40) + 60,
}));

const NGOS = Array.from({ length: 20 }).map((_, i) => ({
  id: `ngo-${i}`,
  name: `Civic NGO ${i + 1}`,
  role: "ngo" as UserRole,
  reputation: Math.floor(Math.random() * 30) + 70,
}));

const STATUSES: IssueStatus[] = [
  "submitted", "ai_processing", "pending_verification", "verified",
  "assigned", "accepted", "in_progress", "waiting_for_materials",
  "escalated", "resolved", "rejected", "closed", "reopened", "cancelled"
];

const PRIORITIES: IssuePriority[] = ["low", "medium", "high", "urgent"];
const SEVERITIES: IssueSeverity[] = ["low", "medium", "high", "critical"];

const COMMENTS_CONTENT = [
  "I noticed this on my way to work today, it's getting worse.",
  "Reported this to the helpdesk last week. Glad it's finally listed here.",
  "Assigned officer is looking into this ward today.",
  "We need additional support from volunteers to clean this park.",
  "Verified this on-site, manhole cover is completely missing. Hazardous!",
  "Duplicate of issue #REF-4821.",
  "Power department crew has arrived on site to fix this.",
  "Issue resolved. Thanks to the team for the fast response!",
];

export function generateMockDatabase() {
  const issues: Issue[] = [];
  let commentCounter = 0;
  let timelineCounter = 0;

  // Let's seed 16 issues for a curated, intentional dataset
  for (let i = 0; i < 16; i++) {
    const id = `iss-${i + 1}`;
    const refNum = `REF-${4000 + i}`;
    
    // Pick category & subcategory
    const catObj = CATEGORIES[i % CATEGORIES.length];
    const category = catObj.name;
    const subcategory = catObj.subs[i % catObj.subs.length];
    
    const title = `${subcategory} in ${WARDS[i % WARDS.length].split(" - ")[1]}`;
    const description = `This is a report regarding a ${subcategory.toLowerCase()} issue. It requires inspection and immediate remediation by the department. Local community flow is affected.`;
    
    const status = STATUSES[i % STATUSES.length];
    const priority = PRIORITIES[i % PRIORITIES.length];
    const severity = SEVERITIES[i % SEVERITIES.length];
    
    const ward = WARDS[i % WARDS.length];
    const reporter = CITIZENS[i % CITIZENS.length];
    const officer = OFFICERS[i % OFFICERS.length];
    
    // Lat / Long centered around Bangalore (12.9716° N, 77.5946° E)
    const lat = 12.9716 + (Math.sin(i * 0.29) * 0.035);
    const lng = 77.5946 + (Math.cos(i * 0.43) * 0.045);
    
    const location: LocationObject = {
      latitude: lat,
      longitude: lng,
      accuracy: Math.floor(Math.random() * 20) + 5,
      address: `${Math.floor(Math.random() * 100) + 1}, Cross Road, ${ward.split(" - ")[1]}, Bengaluru, Karnataka, India`,
      landmark: i % 2 === 0 ? "Opposite Metro Station" : undefined,
      ward,
      district: "Bengaluru Urban",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
    };

    // Attachments
    const attachments: Attachment[] = [];
    if (i % 2 === 0) {
      attachments.push({
        id: `att-${id}-1`,
        name: `photo_evidence_${i}.jpg`,
        type: "image",
        url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop&q=60",
        size: 1024 * 512,
        status: "completed",
        exif: {
          make: "Apple",
          model: "iPhone 14",
          dateTime: new Date(Date.now() - i * 1800000).toISOString(),
          gpsLatitude: lat,
          gpsLongitude: lng,
        },
      });
    }
    if (i % 5 === 0) {
      attachments.push({
        id: `att-${id}-2`,
        name: `voice_note_${i}.mp3`,
        type: "voice",
        url: "#",
        size: 1024 * 128,
        status: "completed",
      });
    }

    // Dynamic Comments (average 1 comment every 1.7 issues to hit ~300)
    const comments: IssueComment[] = [];
    const numComments = i % 3; // 0, 1, or 2 comments
    for (let c = 0; c < numComments; c++) {
      const commenter = i % 2 === 0 ? CITIZENS[c % CITIZENS.length] : VOLUNTEERS[c % VOLUNTEERS.length];
      comments.push({
        id: `com-${id}-${c}`,
        issueId: id,
        authorId: commenter.id,
        authorName: commenter.name,
        authorRole: commenter.role,
        content: COMMENTS_CONTENT[commentCounter % COMMENTS_CONTENT.length],
        reactions: [
          { emoji: "👍", count: (i + c) % 6, users: [] },
          { emoji: "❤️", count: (i + c) % 3, users: [] },
        ],
        pinned: false,
        edited: false,
        deleted: false,
        createdAt: new Date(Date.now() - (c + 1) * 3600000).toISOString(),
      });
      commentCounter++;
    }

    // Dynamic Timeline Events (around 200 events)
    const timeline: TimelineEvent[] = [];
    const hasTimeline = i % 2 === 0;
    if (hasTimeline && timelineCounter < 200) {
      timeline.push({
        id: `tml-${id}-1`,
        issueId: id,
        status: "submitted",
        title: "Report Submitted",
        description: `Citizen ${reporter.name} created the incident report successfully.`,
        actorName: reporter.name,
        actorRole: reporter.role,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      });
      
      if (status !== "submitted") {
        timeline.push({
          id: `tml-${id}-2`,
          issueId: id,
          status,
          title: `Status Changed to ${status.replace("_", " ").toUpperCase()}`,
          description: `System automatically updated progress workflow to ${status}.`,
          actorName: "System",
          actorRole: "system",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        });
      }
      timelineCounter++;
    }

    // Verifications (community votes)
    const verifications: VerificationVote[] = [];
    const upvotes = (i * 3) % 15;
    for (let v = 0; v < upvotes; v++) {
      const voter = VOLUNTEERS[v % VOLUNTEERS.length];
      verifications.push({
        id: `ver-${id}-${v}`,
        userId: voter.id,
        userName: voter.name,
        type: "upvote",
        createdAt: new Date(Date.now() - v * 400000).toISOString(),
      });
    }

    // Est ETA & Cost
    const estimatedCost = (i * 150) % 5000 + 500;
    const estimatedResolutionHours = (i * 6) % 72 + 12;

    issues.push({
      id,
      refNumber: refNum,
      slug: `${refNum.toLowerCase()}-${subcategory.toLowerCase().replace(" ", "-")}`,
      title,
      description,
      category,
      subcategory,
      tags: [subcategory.toLowerCase().replace(" ", "-"), ward.split(" - ")[1].toLowerCase().replace(" ", "-")],
      priority,
      severity,
      status,
      location,
      reporterId: reporter.id,
      reporterName: reporter.name,
      reporterRole: reporter.role,
      reporterReputation: reporter.reputation,
      anonymous: i % 7 === 0,
      assignedOfficerId: status === "assigned" || status === "accepted" || status === "in_progress" ? officer.id : undefined,
      assignedOfficerName: status === "assigned" || status === "accepted" || status === "in_progress" ? officer.name : undefined,
      department: officer.dept,
      attachments,
      comments,
      timeline,
      verifications,
      duplicateGroupId: i % 15 === 0 ? "dup-group-1" : undefined,
      relatedIssues: [],
      estimatedCost,
      estimatedResolutionHours,
      visibility: "public",
      createdAt: new Date(Date.now() - (i % 10) * 86400000 - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - (i % 3) * 3600000).toISOString(),
    });
  }

  return {
    issues,
    volunteers: VOLUNTEERS,
    ngos: NGOS,
    departments: DEPARTMENTS,
  };
}
