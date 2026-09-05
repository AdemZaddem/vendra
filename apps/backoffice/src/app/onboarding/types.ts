export type Governorate =
  | "tunis" | "ariana" | "ben_arous" | "manouba" | "nabeul" | "zaghouan"
  | "bizerte" | "beja" | "jendouba" | "kef" | "siliana" | "kairouan"
  | "kasserine" | "sidi_bouzid" | "sousse" | "monastir" | "mahdia"
  | "sfax" | "gafsa" | "tozeur" | "kebili" | "gabes" | "medenine" | "tataouine";

export interface OnboardingData {
  name: string;
  slug: string;
  category: string;
  logoUrl?: string;
  tagline?: string;
  brandColor?: string;
  themeId?: string;
  contactPhone?: string;
  contactEmail?: string;
  governorates: Governorate[];
}

export interface StepProps {
  data: Partial<OnboardingData>;
  updateData: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}