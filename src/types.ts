export type PropertyStatus = 'Available' | 'Sold' | 'Plan Cancelled';

export type PropertyType = 'Residential Plot' | 'Residential House' | 'Commercial Space' | 'Shop' | 'Office space' | 'Farm House' | 'Farm Land' | 'Flat/Apartment' | 'Office' | 'Co-working Space';
export type FacingType = 'East' | 'West' | 'South' | 'North' | 'South-East' | 'South-West' | 'North-East' | 'North-West';
export type RoadType = 'Paved' | 'Kacha' | 'Main Road';
export type DocStatus = 'Original' | 'Photocopy' | 'None';
export type QuotedBy = 'Owner' | 'Broker';
export type Purpose = 'Rent' | 'Sale';
export type PurchasePurpose = 'Rent' | 'Purchase';
export type LeadSource = 'Direct' | 'Broker';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface FloorDetails {
  bedrooms: number;
  washrooms: number;
  livingRooms: number;
  kitchens: number;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  description: string; // Legacy/General description
  remarks: string;     // General remarks field
  price: string;       // Changed to string for manual typing (e.g., "50 Lacs")
  city: string;        // Mandatory city field
  
  // Address & Location
  location: string;
  landmark: string;
  geopoint: GeoPoint;
  
  // Plot Details
  facing?: FacingType;
  cornerSideFront?: string;
  cornerSideSide?: string;
  openSides?: number;
  plotAreaSqYd?: number;
  plotAreaSqMtr?: number;
  dimensionsLength?: number;
  dimensionsWidth?: number;
  
  // Construction Details
  builtUpAreaSqFt?: number;
  floors?: {
    ground?: FloorDetails;
    first?: FloorDetails;
    second?: FloorDetails;
    third?: FloorDetails;
    fourth?: FloorDetails;
    roof?: FloorDetails;
  };
  
  // Parking (Checkboxes now)
  carParking: boolean;
  bikeParking: boolean;

  // Rental Specifics
  securityDeposit?: string;
  occupancy?: 'Independent' | 'Co-occupied';
  wardrobes?: number;
  furnishing?: boolean;
  floorNumber?: number;
  frontage?: string;
  loadingDock?: boolean;
  ceilingHeight?: string;
  amenities?: {
    fan: boolean;
    waterpump: boolean;
    submeter: boolean;
    ac: boolean;
  };

  // Other
  roadType?: RoadType;
  roadWidth?: number;
  gatedSociety: boolean;
  
  status: PropertyStatus;
  images: string[];
  
  // CRM
  ownerName: string;
  phoneNumber: string;
  whatsappNumber: string;
  
  // Visit Details
  addedAt?: string; // ISO string
  visitTime?: string; // ISO string
  visitedBy?: string;
  
  // Documentation
  mutationDoc?: DocStatus;
  saleDeedDoc?: DocStatus;
  gpaDoc?: DocStatus;
  possessionLetterDoc?: DocStatus;
  leaseDoc?: DocStatus;
  leaseTenure?: string;
  propertyTaxPaid?: boolean;
  electricityBillPaid?: boolean;
  houseTaxPaid?: boolean;
  siteMapApproved?: boolean;
  
  // Pricing Additions
  negotiable?: boolean;
  quotedBy?: QuotedBy;
  pricingRemarks?: string;
  
  // Legal Status
  clearTitle?: boolean;
  disputed?: boolean;
  underMortgage?: boolean;
  mortgageBankName?: string;
  jointOwnership?: boolean;
  freehold?: boolean;
  leasehold?: boolean;
  
  // Environment
  surroundingResidential?: boolean;
  surroundingCommercial?: boolean;
  surroundingMixed?: boolean;
  
  nearbyHospital?: boolean;
  nearbyPark?: boolean;
  nearbySchool?: boolean;
  nearbyMarket?: boolean;
  nearbyPublicTransport?: boolean;
  
  // Second Visit
  secondVisitTime?: string; // ISO string
  secondVisitConfirmed?: boolean;

  // Marketplace
  is_public?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  interestedIn: string; // Property ID
  notes: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  
  // New Client Fields
  profession?: string;
  residentAddress?: string;
  purpose?: PurchasePurpose;
  email?: string;
  budgetMin?: string;
  budgetMax?: string;
  location?: string;
  preferredFacing?: FacingType;
  source?: LeadSource;

  // Cart
  cartProperties?: string[]; // Array of Property IDs
}

export interface CompanySettings {
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  customerCareEmail: string; // 7keydeals@gmail.com un-editable
  clientVisitTemplate: string;
  propertyOwnerTemplate: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface SubscriptionPayment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'marketplace' | 'project_ad';
}

export interface AdminSettings {
  marketplaceSubscriptionEnabled: boolean;
  marketplaceSubscriptionAmount: number;
  projectAdSubscriptionAmount: number;
  rentalPostingFee: number;
}

export interface Advertisement {
  id: string;
  title: string;
  developerName: string;
  description: string;
  city: string;
  image: string;
  priceRange: string;
  contactNumber: string;
  whatsappNumber: string;
  expiresAt: string;
  isPaid: boolean;
  brochures?: string[];
}

export type UserRole = 'Broker' | 'Owner' | 'Client' | 'Developer';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  isSubscribed: boolean; // This will now represent the Marketplace Subscription (₹300)
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: string; // ISO date string
  unlockedProperties?: string[]; // Array of Property IDs unlocked via per-lead fee
  hasPasskey?: boolean;
  biometricsEnabled?: boolean;
  language?: string;
  referredBy?: string;
  referralCount: number;
  referralEarnedCount: number;
  role?: UserRole;
  onboardingCompleted?: boolean;
  city?: string; // Mandatory for broker directory
  address?: string; // Mandatory for broker directory
  businessProfile?: {
    companyName: string;
    contactPerson: string;
    contactNumber: string;
    developerName?: string;
    projectLocation?: string;
    projectDetails?: string;
    reraApproved?: boolean;
  };
  clientRequirements?: {
    budgetMin: number;
    budgetMax: number;
    landmarks: string;
    propertyType: string;
    directOwnersOnly?: boolean;
    purpose?: PurchasePurpose;
    location?: string;
    postedAt?: string;
  };
}
