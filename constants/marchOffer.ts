export const MARCH_OFFER_CAMPAIGN_ID = "march_2026";
export const MARCH_OFFER_DIALOG_SESSION_KEY = "showMarchOfferModal";
export const MARCH_OFFER_DIALOG_DELAY_MS = 1500;
export const MARCH_OFFER_DIALOG_MAX_WAIT_MS = 6000;
export const MARCH_OFFER_DISCOUNT_PERCENT = 55;
export const MARCH_OFFER_MONTHLY_PRICE = 4.49;
export const MARCH_OFFER_YEARLY_PRICE = 39.99;
export const MARCH_OFFER_END_DATE_LABEL = "30.04.2026";
export const MARCH_OFFER_END_MS = new Date("2026-05-01T00:00:00").getTime();

export const isMarchCampaignActive = () => Date.now() < MARCH_OFFER_END_MS;

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
