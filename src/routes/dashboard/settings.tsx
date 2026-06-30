import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Settings as SettingsIcon, Shield, Award, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useSettingsStore } from "@/shared/stores/settings-store";
import { userService } from "@/shared/services/user-service";
import { Reveal } from "@/lib/motion";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Community Hero AI" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const {
    preferences,
    notificationPreferences,
    privacySettings,
    updatePreferences,
    updateNotificationPreferences,
    updatePrivacySettings,
  } = useSettingsStore();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(user.id, { name, phone });
      updateProfile({ name: updated.name, phone: updated.phone });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile, preferences, and security settings.</p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Profile Card & Info */}
        <Reveal className="space-y-6">
          {user && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-2xl font-bold text-white shadow-soft">
                {user.name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{user.name}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{user.role}</p>

              {user.department && (
                <p className="text-xs text-muted-foreground mt-2 bg-secondary/80 py-1 px-2.5 rounded-full inline-block">
                  {user.department}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6">
                <div>
                  <div className="text-xl font-bold text-primary">{user.trustScore}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Trust Score</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-500">{user.xp}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">XP Earned</div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements widget */}
          {user && user.achievements && user.achievements.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-semibold text-sm flex items-center gap-1.5 mb-4">
                <Award className="h-4.5 w-4.5 text-primary" />
                <span>Unlocked Badges</span>
              </h3>
              <div className="space-y-3">
                {user.achievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 bg-secondary/30 p-2.5 rounded-2xl">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold">{ach.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{ach.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {/* Configurations Tabs */}
        <Reveal className="space-y-6">
          {/* User Profile edit */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <span>Personal Details</span>
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email ?? ""}
                  className="w-full rounded-xl border border-border bg-secondary/60 px-3.5 py-2.5 text-sm outline-none cursor-not-allowed text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Contact Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:bg-primary/95 transition-all disabled:opacity-50"
              >
                {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Save Profile</span>
              </button>
            </form>
          </div>

          {/* Accessibility Preferences */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <span>Accessibility & Theme</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">Reduced Motion</h4>
                  <p className="text-[10px] text-muted-foreground">Minimize transitions and background animations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h4 className="text-xs font-semibold">Workspace Timezone</h4>
                  <p className="text-[10px] text-muted-foreground">Adjust logging timestamps to regional times.</p>
                </div>
                <select
                  value={preferences.timezone}
                  onChange={(e) => updatePreferences({ timezone: e.target.value })}
                  className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Asia/Kolkata">IST (GMT+5:30)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">EST (GMT-5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Trust score settings */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span>Privacy Settings</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">Anonymous Reporting</h4>
                  <p className="text-[10px] text-muted-foreground">Hide profile identification details on public boards.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.anonymousReporting}
                  onChange={(e) => updatePrivacySettings({ anonymousReporting: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <h4 className="text-xs font-semibold">Display XP Leaderboards</h4>
                  <p className="text-[10px] text-muted-foreground">Render rankings on the community activity scoreboards.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showXP}
                  onChange={(e) => updatePrivacySettings({ showXP: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
