export type ImportedStudioStatus =
  | 'IMPORTED'
  | 'PENDING_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'MERGED_DUPLICATE';

export interface ImportedStudioRecord {
  id: string;
  name: string;
  city: 'Bhubaneswar' | 'Cuttack';
  address: string;
  phone: string;
  website: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  danceStyles: string[];
  publicRatings: number;
  reviewCounts: number;
  openingHours: string;
  photos: string[];
  sourceReference: string;
  verificationStatus: ImportedStudioStatus;
  importedAt: string;
  reviewedByAdminId?: string;
  reviewedAt?: string;
  notes?: string;
  rejectionReason?: string;
  duplicateOfId?: string;
  isCurated: boolean;
  hallCapacityEstimate?: number;
}
