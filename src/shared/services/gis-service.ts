import { simulateNetwork } from "./base-service";
import { ActiveRoute } from "../stores/gis-store";

export const routingService = {
  async getRoute(
    start: [number, number],
    end: [number, number],
    type: ActiveRoute["type"] = "officer"
  ): Promise<ActiveRoute> {
    // Generate simulated routing path between start and end
    const stepsCount = 4;
    const coordinates: [number, number][] = [];
    
    // Create linear interpolation path with slight random deviations
    for (let i = 0; i <= stepsCount; i++) {
      const ratio = i / stepsCount;
      const lat = start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * 0.001;
      const lng = start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * 0.001;
      coordinates.push([lat, lng]);
    }

    const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)) * 111; // Approx km
    const distanceKm = parseFloat(distance.toFixed(2));
    const durationMinutes = Math.round(distanceKm * 3.5 + 4); // Avg 3.5 min/km

    const steps = [
      "Depart command checkpoint on primary avenue",
      `Turn right onto secondary road, continue for ${(distanceKm * 0.4).toFixed(1)} km`,
      "Merge onto outer ring bypass past local ward junction",
      `Arrive at coordinates [${end[0].toFixed(4)}, ${end[1].toFixed(4)}] close to reporter landmark`,
    ];

    return simulateNetwork({
      coordinates,
      type,
      steps,
      durationMinutes,
      distanceKm,
    });
  }
};

export const geofenceService = {
  getWardBoundaries() {
    // Return mock ward polygon geo-data centered around Bengaluru
    return [
      {
        name: "Ward 80 - Indiranagar",
        color: "#3b82f6",
        polygon: [
          [12.975, 77.63],
          [12.985, 77.63],
          [12.985, 77.645],
          [12.97, 77.645],
          [12.975, 77.63],
        ] as [number, number][],
      },
      {
        name: "Ward 150 - Bellandur",
        color: "#10b981",
        polygon: [
          [12.92, 77.66],
          [12.935, 77.66],
          [12.935, 77.685],
          [12.915, 77.685],
          [12.92, 77.66],
        ] as [number, number][],
      },
      {
        name: "Ward 93 - Jayanagar",
        color: "#f59e0b",
        polygon: [
          [12.92, 77.58],
          [12.94, 77.58],
          [12.94, 77.60],
          [12.92, 77.60],
          [12.92, 77.58],
        ] as [number, number][],
      }
    ];
  }
};

export const gisAnalyticsService = {
  getSpatialStats() {
    return {
      mostAffectedWard: "Ward 150 - Bellandur (92 Open Reports)",
      fastestDept: "BESCOM - Power Grid (1.8h avg fix time)",
      slowestDept: "BWSSB - Water Operations (36.2h avg resolution)",
      avgResponseHours: 14.5,
      openIssues: 184,
      resolvedToday: 42,
      verificationRatePercentage: 88,
      volunteerCoveragePercentage: 74,
      departmentPerformance: [
        { name: "BBMP - Roads", rating: 82 },
        { name: "BWSSB - Water", rating: 68 },
        { name: "BESCOM - Power", rating: 95 },
        { name: "Forest Dept", rating: 78 },
        { name: "Waste Management", rating: 72 },
      ]
    };
  }
};
