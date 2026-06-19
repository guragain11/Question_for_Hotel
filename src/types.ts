export interface FormData {
  // Section 1
  hotelName: string;
  email: string;
  contactNumber: string;
  location: string;
  locationOther: string;

  // Section 2
  currentSoftware: string[];
  currentSoftwareOther: string;
  biggestProblem: string;
  advancedFeatures: string;

  // Section 3
  paymentStructure: string;
  paymentStructureOther: string;
  currentPayment: string;
  paymentModel: string;
  paymentModelOther: string;

  // Section 4
  migrationWillingness: number;

  // Section 5
  otaPercentage: string;
  hasWebsite: string;
  hasWebsiteOther: string;
  mobileAppImportance: number;
  mobileAppImportanceOther: string;
  seasonalPricingDifficulty: string;
  seasonalPricingDifficultyOther: string;
  multipleProperties: string;
  multiplePropertiesOther: string;
  overbookingFrequency: string;
  overbookingFrequencyOther: string;
  automatedMessages: string;
  automatedMessagesOther: string;
  extraServicesUpsell: string;
  extraServicesUpsellOther: string;
  migrationWillingnessOther: string;

  // Hotel Management System questions
  hasHotelManagementSystem: string;
  hotelManagementSystemName: string;
  whyNotUsingHMS: string;
  wouldUseCustomHMS: string;
  wouldUseCustomHMSOther: string;
  hmsRequirements: string;
  hmsMaxBudget: string;

  // Custom questions
  customAnswers: Record<string, string>;
}

export interface CustomQuestion {
  id: string;
  title: string;
  type: 'short' | 'multiple' | 'checkbox';
  options: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}
