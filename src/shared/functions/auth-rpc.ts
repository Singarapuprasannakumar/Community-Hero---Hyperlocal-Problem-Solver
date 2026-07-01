import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { getSessionProfile } from "../server/auth-server";

export const getAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie("auth_token");
  if (!token) return { isAuthenticated: false, user: null };

  try {
    const userProfile = await getSessionProfile(token);
    if (userProfile) {
      return { isAuthenticated: true, user: userProfile };
    }
  } catch (err) {
    // ignore
  }

  return { isAuthenticated: false, user: null };
});
