import { useAppSettingStore, type PromoWindow } from "@/app/store/appSetting";
import { buildPromoWindow } from "@/constants/marchOffer";

const APP_SETTING_PATH = "/v4/app_setting";

let inFlightRequest: Promise<PromoWindow | null> | null = null;

const requestPromoWindow = async (): Promise<PromoWindow | null> => {
  // Public endpoint: no Authorization header, so the promo also reaches guests.
  const response = await fetch(
    `${process.env.BASE_URL}${APP_SETTING_PATH}?t=${Date.now()}`,
    {
      method: "GET",
      headers: { Accept: "*/*" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`app_setting request failed with status ${response.status}`);
  }

  return buildPromoWindow(await response.json());
};

/**
 * Loads the promo window from the backend and publishes it to the app setting store.
 * Concurrent callers share the in-flight request; a later call refetches.
 */
export const loadPromoAppSetting = (): Promise<PromoWindow | null> => {
  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = requestPromoWindow()
    .then((promo) => {
      useAppSettingStore.getState().setPromo(promo);
      return promo;
    })
    .catch((error) => {
      console.error("Error loading promo app setting:", error);
      // Settle on "no promo" so the UI does not wait on a broken request.
      useAppSettingStore.getState().setPromo(null);
      return null;
    })
    .finally(() => {
      if (inFlightRequest === request) {
        inFlightRequest = null;
      }
    });

  inFlightRequest = request;

  return request;
};

/**
 * Resolves the promo window for imperative call sites that may run before the
 * initial load finished (e.g. the post-login redirect deciding on the dialog).
 */
export const ensurePromoAppSetting = (): Promise<PromoWindow | null> => {
  const { promo, isPromoLoaded } = useAppSettingStore.getState();

  if (isPromoLoaded) {
    return Promise.resolve(promo);
  }

  return loadPromoAppSetting();
};
