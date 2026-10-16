export type InstitutionType = 'all' | 'university' | 'kmtc' | 'polytechnic' | 'tvet';

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  campuses: string[];
  studentCount: string;
  institutionType?: InstitutionType;
  categoryLabel?: string;
}

export type ListingType = 'item' | 'hostel' | 'gig' | 'business';

// Adalo Collection: Users
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  universityId: string;
  campusName: string;
  studentRegNo?: string;
  role: 'student' | 'vendor' | 'admin';
  agreedToTerms: boolean; // MANDATORY: blocked if false
  createdAt: string;
  isVerifiedStudent: boolean;
}

// Adalo Collection properties for all Listings (Marketplace, Housing, Jobs, Services)
export interface Seller {
  name: string;
  role: 'student' | 'verified_vendor' | 'hostel_caretaker' | 'student_freelancer';
  courseOrBiz?: string;
  yearOfStudy?: string;
  phone: string;
  whatsapp: string;
  isVerifiedStudent: boolean;
  trustScore: number;
  reviewsCount: number;
  avatar?: string;
  safeSpot: string;
  mpesaNumber?: string;
  tillNumber?: string;
}

export interface ListingDetails {
  // Marketplace items
  condition?: 'Brand New' | 'Like New' | 'Good Condition' | 'Fair';
  itemCategory?: 'Textbooks' | 'Electronics' | 'Fashion & Thrift' | 'Hostel Appliances' | 'Furniture' | 'Stationery & Notes';
  
  // Housing / Hostels
  hostelType?: 'Bedsitter' | 'Single Room' | '1 Bedroom' | 'Shared Room';
  distanceToGate?: string;
  waterStatus?: string;
  electricityType?: string;
  wifiAvailable?: boolean;
  securityGuard?: boolean;
  roomFeatures?: string[];

  // Jobs / Gigs
  gigDuration?: string;
  skillsNeeded?: string[];
  compensationType?: 'Per Task' | 'Per Hour' | 'Per Day' | 'Monthly';

  // Local vendors / Services
  openingHours?: string;
  deliveryAvailable?: boolean;
  deliveryNote?: string;
  servicesOffered?: string[];
}

// Adalo Collections: Listings, Housing, Jobs
export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  price: number; // in KSh (KES)
  priceLabel?: string; // "/mo", "/semester", "/task", etc.
  isNegotiable?: boolean;
  category: string;
  image: string;
  universityId: string;
  campusName: string;
  institutionType?: InstitutionType; // 'university' | 'kmtc' | 'polytechnic' | 'tvet'
  seller: Seller;
  details: ListingDetails;
  
  // Adalo Core Workflow Properties:
  isApproved: boolean; // Default: false across all collections!
  isFeePaid: boolean;  // KSh 80 / month fee status
  mpesaRef?: string;   // Safaricom M-Pesa transaction code (e.g., QK948XP12)
  listingFeeKsh: number; // 80 KSh
  
  createdAt: string;
  viewsCount: number;
  likesCount: number;
  featured?: boolean;
  
  // Sold Status & Transaction Archival:
  isSold?: boolean;
  soldAt?: string;
  soldPrice?: number;
}

export interface CommunityPost {
  id: string;
  type: 'lost_found' | 'rideshare' | 'study_group' | 'alert';
  title: string;
  content: string;
  author: string;
  authorRole: string;
  universityId: string;
  campusName: string;
  timeAgo: string;
  repliesCount: number;
  likesCount: number;
  statusTag?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
}
