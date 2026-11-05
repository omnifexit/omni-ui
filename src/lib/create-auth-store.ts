import type { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";

export interface AuthState<User> {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;

    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    reset: () => void;
    hasPermission: (permission: string) => boolean;
}

// Logging out here also ends the OmniAuth sign-in, which tells every other app to log out too. It leaves the page.
function logOutOfOmniAuth(authUrl: string | undefined) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${authUrl}/auth/logout-everywhere`;
    const locale = document.createElement("input");
    locale.type = "hidden";
    locale.name = "locale";
    locale.value = document.documentElement.lang;
    form.append(locale);
    document.body.append(form);
    form.submit();
}

const INITIAL_STATE = {
    user: null,
    isAuthenticated: false,
};

// Adds up to a minute, which is how long the API's rate limit lasts.
const TEMPORARY_ERROR_RETRY_DELAYS = [1000, 2000, 4000, 8000, 15000, 30000];

/**
 * The login state of an app that logs in through OmniAuth.
 */
interface AuthStoreOptions {
    authUrl: string | undefined;
    sessionDomain: string | undefined;
    /** A function, because the API and this store each need the other. */
    getApi: () => AxiosInstance;
    /** Drops cached API data, so the next person never sees the previous person's data. */
    clearCache: () => void;
}

export function createAuthStore<User extends { permissions?: string[] }>({
    authUrl,
    sessionDomain,
    getApi,
    clearCache,
}: AuthStoreOptions) {
    const api = () => getApi();

    return create<AuthState<User>>((set, get) => ({
        ...INITIAL_STATE,
        isLoading: true,
        isInitialized: false,

        hasPermission: (permission: string) => {
            const user = get().user;
            if (!user) return false;

            return user.permissions?.includes(permission) ?? false;
        },

        reset: () => {
            Cookies.remove("XSRF-TOKEN", { path: "/", domain: sessionDomain });
            clearCache();
            set({ ...INITIAL_STATE, isInitialized: true, isLoading: false });
        },

        fetchUser: async () => {
            set({ isLoading: true });

            for (const delay of [...TEMPORARY_ERROR_RETRY_DELAYS, null]) {
                try {
                    // If missing, fetch CSRF cookie first
                    if (!Cookies.get("XSRF-TOKEN")) {
                        await api().get("/sanctum/csrf-cookie");
                    }

                    const { data } = await api().get("/api/user");
                    set({
                        user: data,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true,
                    });
                    return;
                } catch (error: unknown) {
                    const status = (error as { response?: { status?: number } }).response?.status;

                    // Too many requests, a server error or no connection says nothing about the session.
                    const isTemporary = status === undefined || status === 429 || status >= 500;

                    if (!isTemporary || delay === null) {
                        set({ ...INITIAL_STATE, isLoading: false, isInitialized: true });
                        return;
                    }

                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        },

        logout: async () => {
            try {
                await api().get("/sanctum/csrf-cookie");
                await api().post("/logout");
            } finally {
                Cookies.remove("XSRF-TOKEN", { path: "/", domain: sessionDomain });
                clearCache();
                set({ ...INITIAL_STATE, isInitialized: true, isLoading: false });
                logOutOfOmniAuth(authUrl);
            }
        },
    }));
}
