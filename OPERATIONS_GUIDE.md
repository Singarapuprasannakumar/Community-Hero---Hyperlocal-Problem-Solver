# Community Hero AI — Operations & SLA Guide

This document describes how municipal department supervisors and operators manage cases using the **Operations Center**.

---

## 1. Case Lifecycle Flow

1. **Intake:** Citizens file issues with photos. AI routes them to the correct department (e.g. Sanitation).
2. **Operations Queue:** Under `/dashboard/admin`, supervisors view live queues.
3. **Escalations:** Clicking "Escalate" updates priority to "critical", automatically triggering audit history change logs.
4. **Transfers:** If AI triaged incorrectly, operators click "Transfer" to reroute cases to another department.

---

## 2. SLA Warning Indicators

- **Nominal (Green):** Countdowns are safe (e.g. >10% SLA remaining).
- **Warning (Amber):** Countdowns drop below warning thresholds. Alert emails dispatch automatically.
- **Breached (Flashing Red):** Timers drop to zero, signaling SLA violation. Timers transition to "Breached" status.
