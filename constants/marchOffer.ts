import { useAppSettingStore, type PromoWindow } from "@/app/store/appSetting";

export const MARCH_OFFER_CAMPAIGN_ID = "march_2026";
export const MARCH_OFFER_DIALOG_SESSION_KEY = "showMarchOfferModal";
export const MARCH_OFFER_DIALOG_DELAY_MS = 1500;
export const MARCH_OFFER_DIALOG_MAX_WAIT_MS = 6000;
export const MARCH_OFFER_DISCOUNT_PERCENT = 55;
export const MARCH_OFFER_MONTHLY_PRICE = 4.49;
export const MARCH_OFFER_YEARLY_PRICE = 39.99;

export const PROMO_APP_SETTING_NAME = "promo";

export const PROMO_FALLBACK_END_DATE_LABEL = "";

const PROMO_DATE_PATTERN = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

const parsePromoDate = (value: unknown, dayOffset = 0): number | null => {
  if (typeof value !== "string") {
    return null;
  }

  const match = PROMO_DATE_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day) + dayOffset);

  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const formatPromoEndLabel = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const match = PROMO_DATE_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;

  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

export const buildPromoWindow = (payload: any): PromoWindow | null => {
  const settings = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
    ? payload
    : [];

  const entry = settings.find((item: any) => item?.name === PROMO_APP_SETTING_NAME);
  if (!entry) {
    return null;
  }

  const detail = Array.isArray(entry.detail) ? entry.detail[0] : entry.detail;

  return {
    status: entry.status === true,
    beginMs: parsePromoDate(detail?.promo_begin),
    endMs: parsePromoDate(detail?.promo_end, 1),
    endLabel: formatPromoEndLabel(detail?.promo_end),
  };
};

export const isPromoWindowActive = (promo: PromoWindow | null | undefined) => {
  if (!promo?.status) {
    return false;
  }

  const now = Date.now();

  if (promo.beginMs !== null && now < promo.beginMs) {
    return false;
  }

  if (promo.endMs !== null && now >= promo.endMs) {
    return false;
  }

  return true;
};

export const isMarchCampaignActive = () =>
  isPromoWindowActive(useAppSettingStore.getState().promo);

export const getPromoEndDateLabel = () =>
  useAppSettingStore.getState().promo?.endLabel ?? PROMO_FALLBACK_END_DATE_LABEL;

const isEligiblePlan = (plan: unknown) => plan === "MONTHLY" || plan === "YEARLY";

export const getMarchOfferDiscountInfo = (profilePayload: any) =>
  profilePayload?.discountInfo ?? profilePayload?.data?.discountInfo ?? null;

export const isMarchOfferEligibleProfile = (profilePayload: any) => {
  const discountInfo = getMarchOfferDiscountInfo(profilePayload);

  if (!discountInfo?.hasActiveDiscount) {
    return false;
  }

  if (discountInfo.campaign !== MARCH_OFFER_CAMPAIGN_ID) {
    return false;
  }

  return Array.isArray(discountInfo.eligiblePlans) && discountInfo.eligiblePlans.some(isEligiblePlan);
};
