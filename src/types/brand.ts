export type BrandCategory =
  | 'all'
  | 'apparel'
  | 'footwear'
  | 'makeup'
  | 'hydration_nutrition'
  | 'audio_sound'
  | 'flooring_protection'
  | 'recovery'
  | 'accessories';

export type BrandApprovalStatus =
  | 'PENDING_APPROVAL'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'
  | 'SUSPENDED';

export interface BrandFeaturedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  badge?: string;
  buyUrl?: string;
}

export interface BrandRecord {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: BrandCategory;
  logoUrl: string;
  heroImageUrl: string;
  websiteUrl: string;
  instagramHandle?: string;
  featuredProducts: BrandFeaturedProduct[];
  discountCode?: string;
  discountPercent?: number;
  danceStylesSupported: string[];
  approvalStatus: BrandApprovalStatus;
  suggestedByUserId?: string;
  suggestedByUserName?: string;
  suggestedAt: string;
  reviewedByAdminId?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  isFeatured: boolean;
  cityAvailability?: string; // e.g. "Pan-India Shipping" or "Bhubaneswar & Cuttack"
}

export interface SuggestBrandPayload {
  name: string;
  tagline: string;
  category: BrandCategory;
  websiteUrl: string;
  instagramHandle?: string;
  danceStylesSupported: string[];
  description: string;
  suggestedByUserName: string;
  contactEmail: string;
}
