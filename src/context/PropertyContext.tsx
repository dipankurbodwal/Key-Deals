import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, PropertyStatus, Lead, CompanySettings, User, Feedback, SubscriptionPayment, AdminSettings, Advertisement } from '../types';
import { supabase } from '../lib/supabase';
import { MOCK_LEADS } from '../data';

export type AppMode = 'Professionals' | 'Marketplace';

interface PropertyContextType {
  properties: Property[];
  addProperty: (prop: Property) => void;
  updateProperty: (prop: Property) => void;
  deleteProperty: (id: string) => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;

  mode: AppMode;
  setMode: (mode: AppMode) => void;

  settings: CompanySettings;
  updateSettings: (settings: CompanySettings) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  activeClient: Lead | null;
  setActiveClient: (client: Lead | null) => void;

  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;

  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  
  payments: SubscriptionPayment[];
  addPayment: (payment: Omit<SubscriptionPayment, 'id' | 'date'>) => void;
  updatePaymentStatus: (id: string, status: SubscriptionPayment['status']) => void;

  adminSettings: AdminSettings;
  updateAdminSettings: (settings: AdminSettings) => void;

  referralReward: boolean;
  setReferralReward: (reward: boolean) => void;
  
  globalLocation: string;
  setGlobalLocation: (location: string) => void;

  advertisements: Advertisement[];
  addAdvertisement: (ad: Advertisement) => void;

  brokers: User[];
  publicLeads: User[];
  unlockProperty: (propertyId: string) => void;
  subscribeToMarketplace: () => void;
  refreshData: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: '',
  contactPerson: '',
  contactNumber: '',
  customerCareEmail: '7keydeals@gmail.com',
  clientVisitTemplate: 'Hello! Here are the details of the properties we visited today:\n[List: Property Type, Landmark, Price]\nFor more details, contact:\n{companyName}\n({Contact Person}) –\n{contactNumber}',
  propertyOwnerTemplate: 'Dear {ownerName},\n\nThank you for listing your property with us.\n\n📍 {address}\n🏷️ {propertyType}\n💰 {price}\n\nWe will keep you updated on any inquiries.\n\nBest Regards,\n{companyName}\n{Contact Person}\n{contactNumber}'
};

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [mode, setMode] = useState<AppMode>('Professionals');
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [activeClient, setActiveClient] = useState<Lead | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('keydeals_dark_mode');
    return saved === 'true';
  });

  const [biometricsEnabled, setBiometricsEnabled] = useState(() => {
    const saved = localStorage.getItem('keydeals_biometrics');
    return saved === 'true';
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: '1', userId: 'u1', userName: 'John Doe', message: 'Great app! Love the search feature.', createdAt: '2023-12-01T10:00:00Z' },
    { id: '2', userId: 'u2', userName: 'Jane Smith', message: 'Could you add more filters for property types?', createdAt: '2023-12-02T11:30:00Z' },
  ]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([
    { id: 'p1', userId: 'u1', userName: 'John Doe', amount: 999, status: 'approved', transactionId: 'TXN123456', date: '2023-12-01T09:00:00Z' },
    { id: 'p2', userId: 'u2', userName: 'Jane Smith', amount: 999, status: 'pending', transactionId: 'TXN789012', date: '2023-12-02T10:00:00Z' },
  ]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    marketplaceSubscriptionEnabled: true,
    marketplaceSubscriptionAmount: 300,
    projectAdSubscriptionAmount: 4999,
    rentalPostingFee: 499,
    leadUnlockFee: 49
  });
  const [publicLeads, setPublicLeads] = useState<User[]>([
    {
      id: 'pl1',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '9876543210',
      isAdmin: false,
      isSubscribed: false,
      subscriptionStatus: 'inactive',
      referralCount: 0,
      referralEarnedCount: 0,
      role: 'Client',
      clientRequirements: {
        purpose: 'On Rent',
        propertyType: 'Flat/Apartment',
        budgetMin: 15000,
        budgetMax: 25000,
        landmarks: 'Sector 14',
        location: 'Rohtak',
        postedAt: new Date().toISOString()
      }
    },
    {
      id: 'pl2',
      name: 'Suresh Singh',
      email: 'suresh@example.com',
      phone: '9876543211',
      isAdmin: false,
      isSubscribed: false,
      subscriptionStatus: 'inactive',
      referralCount: 0,
      referralEarnedCount: 0,
      role: 'Client',
      clientRequirements: {
        purpose: 'Purchase',
        propertyType: 'House/Villa',
        budgetMin: 4000000,
        budgetMax: 6000000,
        landmarks: 'Model Town',
        location: 'Rohtak',
        postedAt: new Date().toISOString()
      }
    }
  ]);
  const [referralReward, setReferralReward] = useState(false);
  const [globalLocation, setGlobalLocation] = useState(() => {
    return localStorage.getItem('keydeals_global_location') || 'All India';
  });
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [brokers, setBrokers] = useState<User[]>([]);

  useEffect(() => {
    localStorage.setItem('keydeals_global_location', globalLocation);
  }, [globalLocation]);

  // Mock brokers for directory
  useEffect(() => {
    const mockBrokers: User[] = [
      {
        id: 'b1',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '9876543210',
        isAdmin: false,
        isSubscribed: true,
        subscriptionStatus: 'active',
        role: 'Broker',
        city: 'Rohtak',
        address: 'Sector 14, Rohtak',
        referralCount: 0,
        referralEarnedCount: 0,
        businessProfile: {
          companyName: 'Kumar Properties',
          contactPerson: 'Rajesh Kumar',
          contactNumber: '9876543210'
        }
      },
      {
        id: 'b2',
        name: 'Amit Sharma',
        email: 'amit@example.com',
        phone: '9876543211',
        isAdmin: false,
        isSubscribed: true,
        subscriptionStatus: 'active',
        role: 'Broker',
        city: 'Gurugram',
        address: 'MG Road, Gurugram',
        referralCount: 0,
        referralEarnedCount: 0,
        businessProfile: {
          companyName: 'Sharma Real Estate',
          contactPerson: 'Amit Sharma',
          contactNumber: '9876543211'
        }
      }
    ];
    setBrokers(mockBrokers);
  }, []);

  // Mock ads
  useEffect(() => {
    const mockAds: Advertisement[] = [
      {
        id: 'ad1',
        title: 'Royal Residency',
        developerName: 'Royal Builders',
        description: 'Luxury 3BHK apartments in the heart of the city.',
        city: 'Rohtak',
        image: 'https://picsum.photos/seed/ad1/800/600',
        priceRange: '₹ 80 Lacs - 1.2 Cr',
        contactNumber: '9999999999',
        whatsappNumber: '9999999999',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isPaid: true
      }
    ];
    setAdvertisements(mockAds);
  }, []);
  
  // Mock user for now. In a real app, this would come from Auth.
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('keydeals_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('keydeals_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('keydeals_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('keydeals_dark_mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('keydeals_biometrics', biometricsEnabled.toString());
  }, [biometricsEnabled]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('keydeals_referral_id', ref);
    }
  }, []);

  const unlockProperty = (propertyId: string) => {
    if (!user) return;
    const unlocked = user.unlockedProperties || [];
    if (unlocked.includes(propertyId)) return;

    setUser({
      ...user,
      unlockedProperties: [...unlocked, propertyId]
    });
  };

  const subscribeToMarketplace = () => {
    if (!user) return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 15);

    setUser({
      ...user,
      isSubscribed: true,
      subscriptionStatus: 'active',
      subscriptionExpiry: expiry.toISOString()
    });
  };

  const addProperty = async (prop: Property) => {
    setProperties([prop, ...properties]);
    
    if (!supabase) return;
    
    try {
      // Map camelCase to snake_case for Supabase
      const { error } = await supabase
        .from('properties')
        .insert([{
          id: prop.id,
          title: prop.title,
          type: prop.type,
          purpose: prop.purpose,
          description: prop.description,
          remarks: prop.remarks,
          price: prop.price,
          city: prop.city,
          location: prop.location,
          landmark: prop.landmark,
          geopoint: prop.geopoint,
          facing: prop.facing,
          corner_side_front: prop.cornerSideFront,
          corner_side_side: prop.cornerSideSide,
          open_sides: prop.openSides,
          plot_area_sq_yd: prop.plotAreaSqYd,
          plot_area_sq_mtr: prop.plotAreaSqMtr,
          dimensions_length: prop.dimensionsLength,
          dimensions_width: prop.dimensionsWidth,
          built_up_area_sq_ft: prop.builtUpAreaSqFt,
          frontage: prop.frontage,
          floor_level: prop.floorLevel,
          washroom_available: prop.washroomAvailable,
          pantry_available: prop.pantryAvailable,
          floors: prop.floors,
          car_parking: prop.carParking,
          bike_parking: prop.bikeParking,
          road_type: prop.roadType,
          road_width: prop.roadWidth,
          gated_society: prop.gatedSociety,
          status: prop.status,
          images: prop.images,
          owner_name: prop.ownerName,
          phone_number: prop.phoneNumber,
          whatsapp_number: prop.whatsappNumber,
          added_at: prop.addedAt,
          visit_time: prop.visitTime,
          visited_by: prop.visitedBy,
          mutation_doc: prop.mutationDoc,
          sale_deed_doc: prop.saleDeedDoc,
          gpa_doc: prop.gpaDoc,
          possession_letter_doc: prop.possessionLetterDoc,
          lease_doc: prop.leaseDoc,
          lease_tenure: prop.leaseTenure,
          property_tax_paid: prop.propertyTaxPaid,
          electricity_bill_paid: prop.electricityBillPaid,
          house_tax_paid: prop.houseTaxPaid,
          site_map_approved: prop.siteMapApproved,
          negotiable: prop.negotiable,
          quoted_by: prop.quotedBy,
          pricing_remarks: prop.pricingRemarks,
          clear_title: prop.clearTitle,
          disputed: prop.disputed,
          under_mortgage: prop.underMortgage,
          mortgage_bank_name: prop.mortgageBankName,
          joint_ownership: prop.jointOwnership,
          freehold: prop.freehold,
          leasehold: prop.leasehold,
          surrounding_residential: prop.surroundingResidential,
          surrounding_commercial: prop.surroundingCommercial,
          surrounding_mixed: prop.surroundingMixed,
          nearby_hospital: prop.nearbyHospital,
          nearby_park: prop.nearbyPark,
          nearby_school: prop.nearbySchool,
          nearby_market: prop.nearbyMarket,
          nearby_public_transport: prop.nearbyPublicTransport,
          second_visit_time: prop.secondVisitTime,
          second_visit_confirmed: prop.secondVisitConfirmed,
          is_public: prop.is_public
        }]);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error adding property to Supabase:', err);
    }
  };

  const updateProperty = async (prop: Property) => {
    setProperties(properties.map(p => p.id === prop.id ? prop : p));
    
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: prop.title,
          type: prop.type,
          purpose: prop.purpose,
          description: prop.description,
          remarks: prop.remarks,
          price: prop.price,
          city: prop.city,
          location: prop.location,
          landmark: prop.landmark,
          geopoint: prop.geopoint,
          facing: prop.facing,
          corner_side_front: prop.cornerSideFront,
          corner_side_side: prop.cornerSideSide,
          open_sides: prop.openSides,
          plot_area_sq_yd: prop.plotAreaSqYd,
          plot_area_sq_mtr: prop.plotAreaSqMtr,
          dimensions_length: prop.dimensionsLength,
          dimensions_width: prop.dimensionsWidth,
          built_up_area_sq_ft: prop.builtUpAreaSqFt,
          frontage: prop.frontage,
          floor_level: prop.floorLevel,
          washroom_available: prop.washroomAvailable,
          pantry_available: prop.pantryAvailable,
          floors: prop.floors,
          car_parking: prop.carParking,
          bike_parking: prop.bikeParking,
          road_type: prop.roadType,
          road_width: prop.roadWidth,
          gated_society: prop.gatedSociety,
          status: prop.status,
          images: prop.images,
          owner_name: prop.ownerName,
          phone_number: prop.phoneNumber,
          whatsapp_number: prop.whatsappNumber,
          added_at: prop.addedAt,
          visit_time: prop.visitTime,
          visited_by: prop.visitedBy,
          mutation_doc: prop.mutationDoc,
          sale_deed_doc: prop.saleDeedDoc,
          gpa_doc: prop.gpaDoc,
          possession_letter_doc: prop.possessionLetterDoc,
          lease_doc: prop.leaseDoc,
          lease_tenure: prop.leaseTenure,
          property_tax_paid: prop.propertyTaxPaid,
          electricity_bill_paid: prop.electricityBillPaid,
          house_tax_paid: prop.houseTaxPaid,
          site_map_approved: prop.siteMapApproved,
          negotiable: prop.negotiable,
          quoted_by: prop.quotedBy,
          pricing_remarks: prop.pricingRemarks,
          clear_title: prop.clearTitle,
          disputed: prop.disputed,
          under_mortgage: prop.underMortgage,
          mortgage_bank_name: prop.mortgageBankName,
          joint_ownership: prop.jointOwnership,
          freehold: prop.freehold,
          leasehold: prop.leasehold,
          surrounding_residential: prop.surroundingResidential,
          surrounding_commercial: prop.surroundingCommercial,
          surrounding_mixed: prop.surroundingMixed,
          nearby_hospital: prop.nearbyHospital,
          nearby_park: prop.nearbyPark,
          nearby_school: prop.nearbySchool,
          nearby_market: prop.nearbyMarket,
          nearby_public_transport: prop.nearbyPublicTransport,
          second_visit_time: prop.secondVisitTime,
          second_visit_confirmed: prop.secondVisitConfirmed,
          is_public: prop.is_public
        })
        .eq('id', prop.id);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error updating property in Supabase:', err);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting property from Supabase:', err);
    }
  };

  const updatePropertyStatus = async (id: string, status: PropertyStatus) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, status } : p
    ));
    
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error updating property status in Supabase:', err);
    }
  };

  const addLead = (lead: Lead) => {
    setLeads([lead, ...leads]);
  };

  const updateLead = (lead: Lead) => {
    setLeads(leads.map(l => l.id === lead.id ? lead : l));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const updateSettings = (newSettings: CompanySettings) => {
    setSettings(newSettings);
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const addPayment = (payment: Omit<SubscriptionPayment, 'id' | 'date'>) => {
    const newPayment: SubscriptionPayment = {
      ...payment,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setPayments([newPayment, ...payments]);
  };

  const updatePaymentStatus = (id: string, status: SubscriptionPayment['status']) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
  };

  const updateAdminSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
  };

  const addAdvertisement = (ad: Advertisement) => {
    setAdvertisements([ad, ...advertisements]);
  };

  const refreshData = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Map snake_case from Supabase to camelCase for the app
        const mappedProperties = data.map((p: any) => ({
          ...p,
          geopoint: p.geopoint || p.geo_point,
          addedAt: p.added_at || p.addedAt || p.created_at,
          visitTime: p.visit_time || p.visitTime,
          ownerName: p.owner_name || p.ownerName,
          phoneNumber: p.phone_number || p.phoneNumber,
          whatsappNumber: p.whatsapp_number || p.whatsappNumber,
          cornerSideFront: p.corner_side_front || p.cornerSideFront,
          cornerSideSide: p.corner_side_side || p.cornerSideSide,
          openSides: p.open_sides || p.openSides,
          plotAreaSqYd: p.plot_area_sq_yd || p.plotAreaSqYd,
          plotAreaSqMtr: p.plot_area_sq_mtr || p.plotAreaSqMtr,
          dimensionsLength: p.dimensions_length || p.dimensionsLength,
          dimensionsWidth: p.dimensions_width || p.dimensionsWidth,
          builtUpAreaSqFt: p.built_up_area_sq_ft || p.builtUpAreaSqFt,
          frontage: p.frontage,
          floorLevel: p.floor_level || p.floorLevel,
          washroomAvailable: p.washroom_available ?? p.washroomAvailable,
          pantryAvailable: p.pantry_available ?? p.pantryAvailable,
          roadType: p.road_type || p.roadType,
          roadWidth: p.road_width || p.roadWidth,
          gatedSociety: p.gated_society ?? p.gatedSociety,
          carParking: p.car_parking ?? p.carParking,
          bikeParking: p.bike_parking ?? p.bikeParking,
          mutationDoc: p.mutation_doc || p.mutationDoc,
          saleDeedDoc: p.sale_deed_doc || p.saleDeedDoc,
          gpaDoc: p.gpa_doc || p.gpaDoc,
          possessionLetterDoc: p.possession_letter_doc || p.possessionLetterDoc,
          leaseDoc: p.lease_doc || p.leaseDoc,
          leaseTenure: p.lease_tenure || p.leaseTenure,
          propertyTaxPaid: p.property_tax_paid ?? p.propertyTaxPaid,
          electricityBillPaid: p.electricity_bill_paid ?? p.electricityBillPaid,
          houseTaxPaid: p.house_tax_paid ?? p.houseTaxPaid,
          siteMapApproved: p.site_map_approved ?? p.siteMapApproved,
          quotedBy: p.quoted_by || p.quotedBy,
          pricingRemarks: p.pricing_remarks || p.pricingRemarks,
          clearTitle: p.clear_title ?? p.clearTitle,
          disputed: p.disputed ?? p.disputed,
          underMortgage: p.under_mortgage ?? p.underMortgage,
          mortgageBankName: p.mortgage_bank_name || p.mortgageBankName,
          jointOwnership: p.joint_ownership ?? p.jointOwnership,
          freehold: p.freehold ?? p.freehold,
          leasehold: p.leasehold ?? p.leasehold,
          surroundingResidential: p.surrounding_residential ?? p.surroundingResidential,
          surroundingCommercial: p.surrounding_commercial ?? p.surroundingCommercial,
          surroundingMixed: p.surrounding_mixed ?? p.surroundingMixed,
          nearbyHospital: p.nearby_hospital ?? p.nearbyHospital,
          nearbyPark: p.nearby_park ?? p.nearbyPark,
          nearbySchool: p.nearby_school ?? p.nearbySchool,
          nearbyMarket: p.nearby_market ?? p.nearbyMarket,
          nearbyPublicTransport: p.nearby_public_transport ?? p.nearbyPublicTransport,
          secondVisitTime: p.second_visit_time || p.secondVisitTime,
          secondVisitConfirmed: p.second_visit_confirmed ?? p.secondVisitConfirmed,
          is_public: p.is_public ?? p.isPublic
        }));
        setProperties(mappedProperties as Property[]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PropertyContext.Provider value={{ 
      properties, addProperty, updateProperty, deleteProperty, updatePropertyStatus,
      leads, addLead, updateLead, deleteLead,
      mode, setMode,
      settings, updateSettings,
      user, setUser,
      activeClient, setActiveClient,
      darkMode, setDarkMode,
      biometricsEnabled, setBiometricsEnabled,
      feedbacks, addFeedback,
      payments, addPayment, updatePaymentStatus,
      adminSettings, updateAdminSettings,
      referralReward, setReferralReward,
      globalLocation, setGlobalLocation,
      advertisements, addAdvertisement,
      brokers,
      publicLeads,
      unlockProperty,
      subscribeToMarketplace,
      refreshData
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}

