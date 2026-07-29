// ==================================================
// PawConnect AI — MVP Feature Flags
// Controls feature availability for Phase 1 Chennai Launch
// ==================================================

export const FEATURE_FLAGS = {
  // Primary MVP Features (ACTIVE)
  ENABLE_ADOPTION: true,
  ENABLE_LOST_AND_FOUND: true,
  ENABLE_MARKETPLACE: true,
  ENABLE_SHELTERS: true,
  ENABLE_VETS_DIR: true,
  ENABLE_GROOMERS_DIR: true,
  ENABLE_NGOS_DIR: true,
  ENABLE_COMMUNITY_FEED: true,
  ENABLE_AI_ASSISTANT: true,

  // Future Enterprise Features (FLAGS - HIDDEN UNTIL POST-MVP)
  ENABLE_AI_VET_DIAGNOSTICS: false,
  ENABLE_AI_BREED_RECOGNITION: false,
  ENABLE_PET_INSURANCE: false,
  ENABLE_PREMIUM_SUBSCRIPTIONS: false,
  ENABLE_ADVANCED_ANALYTICS: false,
  ENABLE_WHITE_LABEL_SaaS: false,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return FEATURE_FLAGS[flag] ?? false;
}
