import axios from "axios";
import { toast } from "../toast";

/** For messages shown outside React, where the translations aren't available. */
export function localized(english: string, dutch: string) {
    return typeof document !== "undefined" && document.documentElement.lang === "nl" ? dutch : english;
}

/**
 * The axios instance of an app that logs in through OmniAuth.
 *
 * @param basePath The service's path, like `/sales`.
 * @param onSessionExpired Called when the API says the session is gone.
 */
export function createApi(basePath: string, onSessionExpired: () => void) {
    const api = axios.create({
        baseURL: basePath,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        withCredentials: true,
        withXSRFToken: true,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
    });

    api.interceptors.request.use((config) => {
        if (typeof window !== "undefined") {
            const pathParts = window.location.pathname.split("/");
            const locale = pathParts[1];
            if (locale === "en" || locale === "nl") {
                config.headers["Accept-Language"] = locale;
            }
        }
        return config;
    });

    const SILENT_ENDPOINTS = ["/api/user", "/logout"];

    const isSilentRequest = (url: string) => SILENT_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    const isOnLoginPage = () => typeof window !== "undefined" && window.location.pathname.includes("/login");

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const url = error.config?.url || "";
            const status = error.response?.status;

            // Handle CSRF token mismatch (419)
            if (status === 419 && !error.config._retry) {
                error.config._retry = true;

                try {
                    await api.get("/sanctum/csrf-cookie");
                    return api(error.config);
                } catch (csrfError) {
                    return Promise.reject(csrfError);
                }
            }

            if (isSilentRequest(url) || isOnLoginPage()) {
                return Promise.reject(error);
            }

            switch (status) {
                case 401:
                    toast.error(
                        localized("Session expired. Please log in again.", "Sessie verlopen. Log opnieuw in."),
                        {
                            id: "session-expired",
                        },
                    );
                    onSessionExpired();
                    break;

                case 403:
                    toast.error(localized("Access denied.", "Geen toegang."));
                    break;

                case 429:
                    toast.error(
                        localized(
                            "Too many requests. Please slow down and try again later.",
                            "Te veel verzoeken. Wacht even en probeer het later opnieuw.",
                        ),
                    );
                    break;
            }

            return Promise.reject(error);
        },
    );

    return api;
}
