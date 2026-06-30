import { useIssueStore } from "../stores/issue-store";
import { useCaseStore, useAuditStore, useSlaStore } from "../stores/enterprise-store";
import { useCommunityStore, useVolunteerStore, useEventStore } from "../stores/community-store";
import { useDemoStore } from "../stores/demo-store";
import { useGISStore } from "../stores/gis-store";
import { auditService } from "./enterprise-service";
import { Issue } from "../types/issue-types";
import { toast } from "sonner";

export const demoScenarios = {
  // Helper to construct a base issue payload
  createMockIssue(title: string, category: string, dept: string, lat: number, lng: number, priority: "low" | "medium" | "high" | "urgent" = "medium"): Issue {
    const id = `iss-demo-${Math.random().toString(36).substr(2)}`;
    return {
      id,
      refNumber: `REF-${Math.floor(Math.random() * 5000) + 1000}`,
      slug: `iss-demo-${id}`,
      title,
      description: `Dynamic simulated issue for demo: ${title} coordinates mapping active.`,
      status: "pending_verification",
      priority,
      severity: "medium",
      category,
      subcategory: title.split(" ")[0],
      tags: [category, "simulated"],
      department: dept,
      reporterId: "cit-1",
      reporterName: "Prasannakumar Singarapu",
      reporterRole: "citizen",
      reporterReputation: 85,
      anonymous: false,
      location: {
        latitude: lat,
        longitude: lng,
        address: `${Math.floor(Math.random() * 100) + 1}, Simulated Lane, Bengaluru, Karnataka, India`,
        ward: "Ward 80 - Indiranagar",
        district: "Bengaluru Urban",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
      },
      attachments: [],
      verifications: [],
      relatedIssues: [],
      estimatedResolutionHours: 24,
      estimatedCost: 15000,
      visibility: "public",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      timeline: []
    };
  },

  triggerHeavyRain() {
    const { createIssue } = useIssueStore.getState();
    const { setWeather, incrementMetric } = useDemoStore.getState();

    setWeather("heavy_rain");
    toast.warning("Scenario Active: Heavy Rain. Simulating waterlogging and street safety incidents...");

    const issues = [
      this.createMockIssue("Bellandur Outer Ring Road Waterlogging", "Water Supply", "Water Supply", 12.925, 77.670, "high"),
      this.createMockIssue("Fallen tree blocking Indiranagar 12th Main", "Roads & Transit", "Roads & Transit", 12.978, 77.640, "urgent")
    ];

    issues.forEach((iss) => {
      createIssue(iss);
      incrementMetric("issuesCreated");
      incrementMetric("eventsGenerated");
    });

    auditService.logAction("System Simulator", "system", "Triggered Heavy Rain Incident Batch");
  },

  triggerTrafficCrisis() {
    const { createIssue } = useIssueStore.getState();
    const { incrementMetric } = useDemoStore.getState();

    toast.info("Scenario Active: Traffic Gridlock. Simulating malfunctioning signal grids...");

    const iss = this.createMockIssue("Richmond Circle Broken Signal Malfunction", "Roads & Transit", "Roads & Transit", 12.960, 77.595, "urgent");
    createIssue(iss);
    
    incrementMetric("issuesCreated");
    incrementMetric("eventsGenerated");
    auditService.logAction("System Simulator", "system", "Triggered Traffic Gridlock Signal Breach");
  },

  triggerGarbageCrisis() {
    const { createIssue } = useIssueStore.getState();
    const { addPost } = useCommunityStore.getState();
    const { incrementMetric } = useDemoStore.getState();

    toast.warning("Scenario Active: Waste Overflow. Simulating illegal trash dumping...");

    const iss = this.createMockIssue("Residency Road Illegal Commercial Trash Dumping", "Sanitation", "Sanitation", 12.970, 77.610, "medium");
    createIssue(iss);

    addPost({
      id: `feed-demo-${Math.random()}`,
      title: "Waste Overflow Alert on Residency Road",
      description: "Severe commercial trash dumping reported. NGO team coordinating cleanup drive registration.",
      type: "announcement",
      authorName: "Indiranagar RWA",
      authorRole: "rwa",
      likesCount: 5,
      commentsCount: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    });

    incrementMetric("issuesCreated");
    incrementMetric("eventsGenerated");
    auditService.logAction("System Simulator", "system", "Triggered Waste Overflow alert");
  },

  triggerPowerFailure() {
    const { createIssue } = useIssueStore.getState();
    const { addSLATimer } = useSlaStore.getState();
    const { incrementMetric } = useDemoStore.getState();

    toast.error("Scenario Active: Grid Outage. Simulating dark zones...");

    const iss = this.createMockIssue("Residency Road Streetlight Dark Zone Outage", "Hazards & Safety", "Hazards & Safety", 12.972, 77.608, "high");
    createIssue(iss);

    addSLATimer({
      caseId: iss.id,
      refNumber: "INC-OUTAGE-80",
      category: "Hazards & Safety",
      slaType: "response",
      secondsRemaining: 1800,
      totalSeconds: 3600,
      warningThresholdPercent: 10,
      status: "warning"
    });

    incrementMetric("issuesCreated");
    incrementMetric("eventsGenerated");
    auditService.logAction("System Simulator", "system", "Triggered Grid Outage SLA Timer");
  },

  // Story Mode Steps Flow
  executeStoryStep(step: number) {
    const { setStoryStep, incrementMetric } = useDemoStore.getState();
    const { createIssue, updateIssue } = useIssueStore.getState();
    const { addPost } = useCommunityStore.getState();
    const { setActiveRoute } = useGISStore.getState();

    setStoryStep(step);

    switch (step) {
      case 1:
        toast.info("Story Step 1: Citizen files a pothole report.");
        const pothole = this.createMockIssue("Story Mode: 100ft Road Pothole", "Roads & Transit", "Roads & Transit", 12.978, 77.640, "high");
        // Save ID in local state or global window namespace to fetch in future steps
        (window as any).__storyPotholeId = pothole.id;
        createIssue(pothole);
        incrementMetric("issuesCreated");
        break;

      case 2:
        toast.success("Story Step 2: AI runtime analyzes and classifies details.");
        const pId2 = (window as any).__storyPotholeId;
        if (pId2) {
          updateIssue(pId2, { estimatedCost: 18000, estimatedResolutionHours: 24, priority: "high" });
          auditService.logAction("AI Engine", "system", "AI triage: Assigned department Roads & Transit, predicted resolution time 24h");
        }
        break;

      case 3:
        toast.success("Story Step 3: GIS map plots pulsing marker at coordinates.");
        // Simulated: Leaflet will render marker via issue store list update
        incrementMetric("eventsGenerated");
        break;

      case 4:
        toast.info("Story Step 4: Neighborhood verification votes increment.");
        const pId4 = (window as any).__storyPotholeId;
        if (pId4) {
          updateIssue(pId4, { status: "verified" });
        }
        break;

      case 5:
        toast.success("Story Step 5: Nearest officer रमेश कुमार assigned.");
        const pId5 = (window as any).__storyPotholeId;
        if (pId5) {
          updateIssue(pId5, { status: "assigned" });
          auditService.logAction("System Router", "system", "Assigned Field Officer Ramesh Kumar");
        }
        break;

      case 6:
        toast.info("Story Step 6: GPS routing vectors computed on map.");
        setActiveRoute({
          coordinates: [[12.978, 77.640], [12.970, 77.610]],
          type: "officer",
          steps: ["Head west on 12th main", "Turn left on Residency Road"],
          durationMinutes: 12,
          distanceKm: 2.4
        });
        incrementMetric("routesCalculated");
        break;

      case 7:
        toast.success("Story Step 7: Operations Center creates tick countdown.");
        const pId7 = (window as any).__storyPotholeId;
        if (pId7) {
          useSlaStore.getState().addSLATimer({
            caseId: pId7,
            refNumber: "INC-STORY-100",
            category: "Roads & Transit",
            slaType: "resolution",
            secondsRemaining: 3600 * 24,
            totalSeconds: 3600 * 24,
            warningThresholdPercent: 10,
            status: "nominal"
          });
        }
        break;

      case 8:
        toast.success("Story Step 8: Officer uploads repair evidence and closes case!");
        const pId8 = (window as any).__storyPotholeId;
        if (pId8) {
          updateIssue(pId8, { status: "resolved" });
          addPost({
            id: `feed-story-res-${Math.random()}`,
            title: "Pothole Resolved on 100ft Road",
            description: "Field Officer Ramesh Kumar completed patching work. Checked and verified by AI consensus.",
            type: "issue_resolved",
            authorName: "System Dispatcher",
            authorRole: "system",
            likesCount: 12,
            commentsCount: 1,
            likedBy: [],
            createdAt: new Date().toISOString()
          });
          auditService.logAction("Officer Ramesh", "officer", "Uploaded repair photo, closed INC-STORY-100");
        }
        break;
    }
  },

  resetAll() {
    const { initializeDatabase } = useIssueStore.getState();
    const { resetDemo } = useDemoStore.getState();
    const { setActiveRoute } = useGISStore.getState();

    // Wipes issues and triggers re-generation
    useIssueStore.setState({ issues: [] });
    initializeDatabase();

    // Wipes routing paths
    setActiveRoute(null);

    // Wipes SLA countdown logs
    useSlaStore.setState({ slaTimers: [] });

    // Wipes simulated posts
    const initialFeed = [
      { id: "feed-1", title: "Residency Road Streetlight Restored!", description: "AI verification matched light restoration work complete. Thanks to RWA team.", type: "issue_resolved" as const, authorName: "Indiranagar RWA", authorRole: "rwa" as const, likesCount: 14, commentsCount: 2, likedBy: [], image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=60", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: "feed-2", title: "Bellandur Tree Plantation Campaign", description: "Clean Green NGO launched a tree planting campaign. Registration open.", type: "campaign_started" as const, authorName: "Clean Green NGO", authorRole: "ngo" as const, likesCount: 22, commentsCount: 5, likedBy: [], createdAt: new Date(Date.now() - 3600000 * 8).toISOString() }
    ];
    useCommunityStore.setState({ feed: initialFeed });

    // Resets demo metrics
    resetDemo();
    toast.success("Simulation variables and municipal databases reset!");
  }
};
