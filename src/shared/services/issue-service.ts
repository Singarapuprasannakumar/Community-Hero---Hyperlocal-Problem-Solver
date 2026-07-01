import { simulateNetwork } from "./base-service";
import { Issue, Attachment, LocationObject, ExifMetadata } from "../types/issue-types";

export const locationService = {
  async getBrowserGPS(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
    // Simulate browser geo-position lookup
    const delay = Math.random() * 800 + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    // Bengaluru center coordinates
    return {
      latitude: 12.9716 + (Math.random() - 0.5) * 0.02,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.02,
      accuracy: Math.floor(Math.random() * 10) + 3, // 3m to 12m accuracy
    };
  },

  async reverseGeocode(lat: number, lng: number): Promise<Partial<LocationObject>> {
    // Mock reverse geocoding lookup
    return simulateNetwork({
      address: `${Math.floor(Math.random() * 80) + 12}, Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025`,
      ward: "Ward 80 - Indiranagar",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      landmark: "Near Imperial Hotel",
    });
  }
};

export const attachmentService = {
  async uploadFile(
    file: { name: string; size: number; type: string },
    onProgress: (progress: number) => void
  ): Promise<Attachment> {
    // Simulate multi-stage upload progress
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onProgress(Math.floor((i / steps) * 100));
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");
    const isPdf = file.type === "application/pdf";

    let fileType: Attachment["type"] = "document";
    if (isImage) fileType = "image";
    else if (isVideo) fileType = "video";
    else if (isAudio) fileType = "voice";
    else if (isPdf) fileType = "pdf";

    // Simulate mock EXIF extract
    let exif: ExifMetadata | undefined;
    if (isImage) {
      exif = {
        make: "Samsung",
        model: "Galaxy S23",
        dateTime: new Date().toISOString(),
        gpsLatitude: 12.9716,
        gpsLongitude: 77.5946,
      };
    }

    return {
      id: `att-up-${Math.random().toString(36).substr(2)}`,
      name: file.name,
      type: fileType,
      url: isImage
        ? "https://images.unsplash.com/photo-1599740831666-42b78d2b9921?w=800&auto=format&fit=crop&q=60"
        : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      size: file.size,
      status: "completed",
      exif,
    };
  }
};

const getApiBase = () => {
  if (typeof window === "undefined") {
    // Server-side rendering
    return process.env.VITE_API_URL || "http://localhost:3000";
  }
  return ""; // Client-side relative path
};

const API_BASE = `${getApiBase()}/api`;

export const issueService = {
  async getAllIssues(): Promise<Issue[]> {
    const res = await fetch(`${API_BASE}/issues`, {
      headers: {
        "Accept": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch issues: ${res.statusText}`);
    }
    return res.json();
  },

  async getIssue(id: string): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      headers: {
        "Accept": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch issue: ${res.statusText}`);
    }
    return res.json();
  },

  async fetchIssueById(id: string, issues?: Issue[]): Promise<Issue> {
    if (issues && issues.length > 0) {
      const issue = issues.find((i) => i.id === id || i.refNumber === id);
      if (issue) return issue;
    }
    return this.getIssue(id);
  },

  async createIssue(issue: Issue): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(issue),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create issue: ${res.statusText}`);
    }
    return res.json();
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update issue: ${res.statusText}`);
    }
    return res.json();
  },

  async deleteIssue(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete issue: ${res.statusText}`);
    }
  }
};
