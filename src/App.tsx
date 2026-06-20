import { useState, useCallback } from 'react';
import {
  Building2,
  Settings,
  CreditCard,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Hotel,
  Shield,
} from 'lucide-react';
import SectionHeader from './components/SectionHeader';
import FormField from './components/FormField';
import TextInput from './components/TextInput';
import TextArea from './components/TextArea';
import SelectInput from './components/SelectInput';
import RadioGroup from './components/RadioGroup';
import CheckboxGroup from './components/CheckboxGroup';
import LinearScale from './components/LinearScale';
import ProgressBar from './components/ProgressBar';
import CustomQuestionBlock from './components/CustomQuestionBlock';
import SuccessScreen from './components/SuccessScreen';
import type { FormData, CustomQuestion } from './types';

function SectionWrapper({
  sectionNum,
  collapsedSections,
  onToggle,
  children,
}: {
  sectionNum: number;
  collapsedSections: Record<number, boolean>;
  onToggle: (section: number) => void;
  children: React.ReactNode;
}) {
  const isCollapsed = collapsedSections[sectionNum];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(sectionNum)}
        className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10 sm:top-8 sm:right-8"
      >
        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>
      {!isCollapsed && children}
      {isCollapsed && (
        <div className="pt-2 pb-2 px-1">
          <p className="text-sm text-slate-400 italic">Section collapsed — click to expand</p>
        </div>
      )}
    </div>
  );
}

const initialFormData: FormData = {
  hotelName: '',
  email: '',
  contactNumber: '',
  location: '',
  locationOther: '',
  currentSoftware: [],
  currentSoftwareOther: '',
  biggestProblem: '',
  advancedFeatures: '',
  paymentStructure: '',
  paymentStructureOther: '',
  currentPayment: '',
  paymentModel: '',
  paymentModelOther: '',
  migrationWillingness: 0,
  migrationWillingnessOther: '',
  otaPercentage: '',
  hasWebsite: '',
  hasWebsiteOther: '',
  mobileAppImportance: 0,
  mobileAppImportanceOther: '',
  seasonalPricingDifficulty: '',
  seasonalPricingDifficultyOther: '',
  multipleProperties: '',
  multiplePropertiesOther: '',
  overbookingFrequency: '',
  overbookingFrequencyOther: '',
  automatedMessages: '',
  automatedMessagesOther: '',
  extraServicesUpsell: '',
  extraServicesUpsellOther: '',
  hasHotelManagementSystem: '',
  hotelManagementSystemName: '',
  whyNotUsingHMS: '',
  wouldUseCustomHMS: '',
  wouldUseCustomHMSOther: '',
  hmsRequirements: '',
  hmsMaxBudget: '',
  customAnswers: {},
};

const locationOptions = [
  { value: 'thamel', label: 'Thamel' },
  { value: 'boudha', label: 'Boudha' },
  { value: 'lazimpat', label: 'Lazimpat' },
  { value: 'durbar_marg', label: 'Durbar Marg' },
  { value: 'patan', label: 'Patan' },
  { value: 'bhaktapur', label: 'Bhaktapur' },
  { value: 'nagarkot', label: 'Nagarkot' },
  { value: 'other', label: 'Other' },
];

const softwareOptions = [
  { value: 'booking_com', label: 'Booking.com' },
  { value: 'agoda', label: 'Agoda' },
  { value: 'cloudbeds', label: 'Cloudbeds' },
  { value: 'oyo', label: 'OYO' },
  { value: 'inhouse', label: 'In-house / Custom System' },
  { value: 'none', label: 'None' },
  { value: 'other', label: 'Other' },
];

// Custom Answer Input Component
function CustomAnswerInput({
  value,
  onChange,
  placeholder = 'Add your own answer or additional comments...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <label className="text-xs font-medium text-slate-500 mb-1.5 block flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Custom Answer / Comments
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm
          placeholder:text-slate-400 hover:border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 
          focus:bg-white transition-all"
      />
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSection = (section: number) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addCustomQuestion = () => {
    const newQ: CustomQuestion = {
      id: `custom_${Date.now()}`,
      title: '',
      type: 'short',
      options: ['Option 1', 'Option 2'],
    };
    setCustomQuestions((prev) => [...prev, newQ]);
  };

  const updateCustomQuestion = (id: string, updated: CustomQuestion) => {
    setCustomQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
    setFormData((prev) => {
      const newAnswers = { ...prev.customAnswers };
      delete newAnswers[id];
      return { ...prev, customAnswers: newAnswers };
    });
  };

  const updateCustomAnswer = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [id]: value },
    }));
  };

  const calculateProgress = (): number => {
    const fields: (keyof FormData)[] = [
      'hotelName', 'email', 'contactNumber', 'location',
      'biggestProblem', 'advancedFeatures', 'paymentStructure', 'currentPayment', 'paymentModel',
      'otaPercentage', 'hasWebsite', 'seasonalPricingDifficulty', 'multipleProperties',
      'overbookingFrequency', 'automatedMessages', 'extraServicesUpsell', 
      'hasHotelManagementSystem', 'wouldUseCustomHMS', 'hmsRequirements', 'hmsMaxBudget',
    ];

    let filled = 0;
    fields.forEach((key) => {
      const val = formData[key];
      if (typeof val === 'string' && val.trim()) filled++;
    });

    if (formData.currentSoftware.length > 0) filled++;
    if (formData.migrationWillingness > 0) filled++;
    if (formData.mobileAppImportance > 0) filled++;

    const total = fields.length + 3;
    return Math.round((filled / total) * 100);
  };

  const getCurrentSection = (): number => {
    if (!formData.hotelName && !formData.contactNumber && !formData.location) return 1;
    if (formData.currentSoftware.length === 0 && !formData.biggestProblem) return 2;
    if (!formData.paymentStructure && !formData.paymentModel) return 3;
    if (formData.migrationWillingness === 0) return 4;
    return 5;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, customQuestions };
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit');
    } catch (err) {
      console.error('Submit failed:', err);
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCustomQuestions([]);
    setSubmitted(false);
    window.scrollTo({ top: 0 });
  };

  if (submitted) {
    return <SuccessScreen onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Admin Link */}
      <div className="fixed top-4 right-4 z-50">
        <a
          href="/admin"
          className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition opacity-50 hover:opacity-100"
          title="Admin Dashboard"
        >
          Admin
        </a>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-500 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Hotel className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white/90">Market Research 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Hotel Booking System
            <span className="block text-primary-200">Market Survey</span>
          </h1>
          <p className="text-base sm:text-lg text-primary-100 max-w-xl mx-auto leading-relaxed">
            Help us build the perfect booking platform for hotels in Kathmandu.
            Your feedback directly shapes the product.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-primary-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>~8 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 pb-16 relative z-10">
        {/* Progress Bar Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-5 sm:p-6 mb-6">
          <ProgressBar
            progress={calculateProgress()}
            totalSections={6}
            currentSection={getCurrentSection()}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION 1 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6 animate-fade-in-up">
            <SectionWrapper sectionNum={1} collapsedSections={collapsedSections} onToggle={toggleSection}>
              <SectionHeader
                number={1}
                title="Basic Information"
                description="Tell us about your hotel and how we can reach you."
                icon={<Building2 className="w-6 h-6 text-white" />}
              />

              <FormField label="Hotel Name" questionNumber={1}>
                <TextInput
                  value={formData.hotelName}
                  onChange={(v) => updateField('hotelName', v)}
                  placeholder="e.g., Hotel Yak & Yeti"
                />
              </FormField>

              <FormField label="Email Address" questionNumber={2}>
                <TextInput
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  placeholder="e.g., info@hotelyakyeti.com"
                  type="email"
                />
              </FormField>

              <FormField label="Contact Number" questionNumber={3}>
                <TextInput
                  value={formData.contactNumber}
                  onChange={(v) => updateField('contactNumber', v)}
                  placeholder="e.g., +977 9841XXXXXX"
                  type="tel"
                />
              </FormField>

              <FormField label="Location / Area in Kathmandu" questionNumber={4}>
                <SelectInput
                  value={formData.location}
                  onChange={(v) => updateField('location', v)}
                  options={locationOptions}
                  placeholder="Select your area..."
                />
                <CustomAnswerInput
                  value={formData.locationOther}
                  onChange={(v) => updateField('locationOther', v)}
                  placeholder="Specify other location or add details..."
                />
              </FormField>
            </SectionWrapper>
          </div>

          {/* SECTION 2 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6 animate-fade-in-up">
            <SectionWrapper sectionNum={2} collapsedSections={collapsedSections} onToggle={toggleSection}>
              <SectionHeader
                number={2}
                title="Current Operations & Pain Points"
                description="Help us understand what's working and what's not."
                icon={<Settings className="w-6 h-6 text-white" />}
              />

              <FormField
                label="Which booking software or channel manager are you currently using?"
                questionNumber={5}
                hint="Select all that apply"
              >
                <CheckboxGroup
                  values={formData.currentSoftware}
                  onChange={(v) => updateField('currentSoftware', v)}
                  options={softwareOptions}
                />
                <CustomAnswerInput
                  value={formData.currentSoftwareOther}
                  onChange={(v) => updateField('currentSoftwareOther', v)}
                  placeholder="Specify other software or add details..."
                />
              </FormField>

              <FormField
                label="What is the biggest problem or limitation you face with your current booking system?"
                questionNumber={6}
              >
                <TextArea
                  value={formData.biggestProblem}
                  onChange={(v) => updateField('biggestProblem', v)}
                  placeholder="Describe the challenges you're facing..."
                />
              </FormField>

              <FormField
                label="What advanced features could be added to make your daily operations much easier?"
                questionNumber={7}
              >
                <TextArea
                  value={formData.advancedFeatures}
                  onChange={(v) => updateField('advancedFeatures', v)}
                  placeholder="What features would make your life easier? e.g., Auto room assignment, dynamic pricing..."
                />
              </FormField>
            </SectionWrapper>
          </div>

          {/* SECTION 3 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6 animate-fade-in-up">
            <SectionWrapper sectionNum={3} collapsedSections={collapsedSections} onToggle={toggleSection}>
              <SectionHeader
                number={3}
                title="Pricing & Payments"
                description="Understanding your current pricing and payment workflows."
                icon={<CreditCard className="w-6 h-6 text-white" />}
              />

              <FormField
                label="What type of payment structure do your guests prefer or use most?"
                questionNumber={8}
              >
                <RadioGroup
                  name="paymentStructure"
                  value={formData.paymentStructure}
                  onChange={(v) => updateField('paymentStructure', v)}
                  options={[
                    { value: 'online_first', label: 'Pay Online / Deposit First' },
                    { value: 'pay_at_property', label: 'Pay After Visit / At Property' },
                    { value: 'hybrid', label: 'Hybrid (Mix of both)' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.paymentStructureOther}
                  onChange={(v) => updateField('paymentStructureOther', v)}
                  placeholder="Describe other payment structures or add details..."
                />
              </FormField>

              <FormField
                label="How much are you currently paying for your booking service/software?"
                questionNumber={9}
                hint="Enter amount in NPR or USD per month"
              >
                <TextInput
                  value={formData.currentPayment}
                  onChange={(v) => updateField('currentPayment', v)}
                  placeholder="e.g., NPR 5,000/month or 15% commission"
                />
              </FormField>

              <FormField
                label="What is your current payment model for this service?"
                questionNumber={10}
              >
                <RadioGroup
                  name="paymentModel"
                  value={formData.paymentModel}
                  onChange={(v) => updateField('paymentModel', v)}
                  options={[
                    { value: 'commission', label: 'Commission-per-booking %' },
                    { value: 'monthly', label: 'Monthly Subscription' },
                    { value: 'yearly', label: 'Yearly Subscription' },
                    { value: 'onetime', label: 'One-time Licensing Fee' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.paymentModelOther}
                  onChange={(v) => updateField('paymentModelOther', v)}
                  placeholder="Describe other payment models or add details..."
                />
              </FormField>
            </SectionWrapper>
          </div>

          {/* SECTION 4 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6 animate-fade-in-up">
            <SectionWrapper sectionNum={4} collapsedSections={collapsedSections} onToggle={toggleSection}>
              <SectionHeader
                number={4}
                title="Future Interest & Scalability"
                description="Gauging your interest in a custom solution."
                icon={<TrendingUp className="w-6 h-6 text-white" />}
              />

              <FormField
                label="If you had a 100% custom booking system integrated directly into your own website (eliminating third-party commissions), would you fully migrate to it?"
                questionNumber={11}
              >
                <LinearScale
                  value={formData.migrationWillingness}
                  onChange={(v) => updateField('migrationWillingness', v)}
                  minLabel="Definitely Not"
                  maxLabel="Absolutely Yes"
                />
                <CustomAnswerInput
                  value={formData.migrationWillingnessOther}
                  onChange={(v) => updateField('migrationWillingnessOther', v)}
                  placeholder="Share any conditions, concerns, or additional thoughts..."
                />
              </FormField>
            </SectionWrapper>
          </div>

          {/* SECTION 5 */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6 animate-fade-in-up">
            <SectionWrapper sectionNum={5} collapsedSections={collapsedSections} onToggle={toggleSection}>
              <SectionHeader
                number={5}
                title="Additional Market Research"
                description="10 standardized questions for deeper insights."
                icon={<BarChart3 className="w-6 h-6 text-white" />}
              />

              <FormField
                label="What percentage of your bookings come from OTAs (like Booking/Agoda) vs. direct walk-ins/calls?"
                questionNumber={12}
                hint="e.g., 60% OTA, 40% direct"
              >
                <TextInput
                  value={formData.otaPercentage}
                  onChange={(v) => updateField('otaPercentage', v)}
                  placeholder="e.g., 60% OTA, 40% Direct"
                />
              </FormField>

              <FormField
                label="Do you currently have a functioning, independent website for your hotel?"
                questionNumber={13}
              >
                <RadioGroup
                  name="hasWebsite"
                  value={formData.hasWebsite}
                  onChange={(v) => updateField('hasWebsite', v)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.hasWebsiteOther}
                  onChange={(v) => updateField('hasWebsiteOther', v)}
                  placeholder="Share website URL or add details about your web presence..."
                />
              </FormField>

              <FormField
                label="How important is a mobile app version of the backend system for managing your hotel on the go?"
                questionNumber={14}
              >
                <LinearScale
                  value={formData.mobileAppImportance}
                  onChange={(v) => updateField('mobileAppImportance', v)}
                  minLabel="Not Important"
                  maxLabel="Very Important"
                />
                <CustomAnswerInput
                  value={formData.mobileAppImportanceOther}
                  onChange={(v) => updateField('mobileAppImportanceOther', v)}
                  placeholder="What features would you want in a mobile app?"
                />
              </FormField>

              <FormField
                label="Do you offer seasonal pricing, and how difficult is it to update in your current system?"
                questionNumber={15}
              >
                <RadioGroup
                  name="seasonalPricing"
                  value={formData.seasonalPricingDifficulty}
                  onChange={(v) => updateField('seasonalPricingDifficulty', v)}
                  options={[
                    { value: 'very_easy', label: 'Very Easy' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'difficult', label: 'Difficult' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.seasonalPricingDifficultyOther}
                  onChange={(v) => updateField('seasonalPricingDifficultyOther', v)}
                  placeholder="Describe your seasonal pricing challenges or needs..."
                />
              </FormField>

              <FormField
                label="Do you manage multiple properties under the same management?"
                questionNumber={16}
              >
                <RadioGroup
                  name="multipleProperties"
                  value={formData.multipleProperties}
                  onChange={(v) => updateField('multipleProperties', v)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.multiplePropertiesOther}
                  onChange={(v) => updateField('multiplePropertiesOther', v)}
                  placeholder="How many properties? Any multi-property management needs?"
                />
              </FormField>

              <FormField
                label="How often do you experience overbooking or synchronization delays between channels?"
                questionNumber={17}
              >
                <RadioGroup
                  name="overbooking"
                  value={formData.overbookingFrequency}
                  onChange={(v) => updateField('overbookingFrequency', v)}
                  options={[
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'frequently', label: 'Frequently' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.overbookingFrequencyOther}
                  onChange={(v) => updateField('overbookingFrequencyOther', v)}
                  placeholder="Describe any overbooking incidents or sync issues..."
                />
              </FormField>

              <FormField
                label="Would you want automated WhatsApp/SMS confirmation messages sent to your guests upon booking?"
                questionNumber={18}
              >
                <RadioGroup
                  name="automatedMessages"
                  value={formData.automatedMessages}
                  onChange={(v) => updateField('automatedMessages', v)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.automatedMessagesOther}
                  onChange={(v) => updateField('automatedMessagesOther', v)}
                  placeholder="What other automated messages would be useful?"
                />
              </FormField>

              <FormField
                label="Do you offer extra services during booking (e.g., airport pickup, local tours) that you wish you could upsell online?"
                questionNumber={19}
              >
                <RadioGroup
                  name="extraServices"
                  value={formData.extraServicesUpsell}
                  onChange={(v) => updateField('extraServicesUpsell', v)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.extraServicesUpsellOther}
                  onChange={(v) => updateField('extraServicesUpsellOther', v)}
                  placeholder="List the services you'd like to upsell online..."
                />
              </FormField>

              <FormField
                label="Do you currently have a Hotel Management System (HMS)?"
                questionNumber={20}
              >
                <RadioGroup
                  name="hasHotelManagementSystem"
                  value={formData.hasHotelManagementSystem}
                  onChange={(v) => updateField('hasHotelManagementSystem', v)}
                  options={[
                    { value: 'yes', label: 'Yes, I use one' },
                    { value: 'no', label: 'No, I don\'t use any' },
                  ]}
                />
              </FormField>

              {formData.hasHotelManagementSystem === 'yes' && (
                <FormField
                  label="What is the name of your Hotel Management System?"
                  questionNumber={21}
                >
                  <TextInput
                    value={formData.hotelManagementSystemName}
                    onChange={(v) => updateField('hotelManagementSystemName', v)}
                    placeholder="e.g., Opera PMS, Hotelogix, eZee FrontDesk, etc."
                  />
                </FormField>
              )}

              {formData.hasHotelManagementSystem === 'no' && (
                <FormField
                  label="Why are you not using a Hotel Management System?"
                  questionNumber={21}
                >
                  <TextArea
                    value={formData.whyNotUsingHMS}
                    onChange={(v) => updateField('whyNotUsingHMS', v)}
                    placeholder="e.g., Too expensive, don't know about them, current system works fine, etc."
                  />
                </FormField>
              )}

              <FormField
                label="If I built a custom Hotel Management System tailored for your needs, would you use it?"
                questionNumber={22}
              >
                <RadioGroup
                  name="wouldUseCustomHMS"
                  value={formData.wouldUseCustomHMS}
                  onChange={(v) => updateField('wouldUseCustomHMS', v)}
                  options={[
                    { value: 'definitely_yes', label: 'Definitely Yes' },
                    { value: 'probably_yes', label: 'Probably Yes' },
                    { value: 'maybe', label: 'Maybe, depends on features & price' },
                    { value: 'probably_no', label: 'Probably No' },
                    { value: 'definitely_no', label: 'Definitely No' },
                  ]}
                />
                <CustomAnswerInput
                  value={formData.wouldUseCustomHMSOther}
                  onChange={(v) => updateField('wouldUseCustomHMSOther', v)}
                  placeholder="Any conditions or concerns? What would convince you?"
                />
              </FormField>

              <FormField
                label="What features and requirements would you expect from a Hotel Management System?"
                questionNumber={23}
              >
                <TextArea
                  value={formData.hmsRequirements}
                  onChange={(v) => updateField('hmsRequirements', v)}
                  placeholder="e.g., Room booking, guest management, billing, reports, inventory, staff management, integrations with OTAs, mobile app, etc."
                  rows={5}
                />
              </FormField>

              <FormField
                label="What is the maximum amount you would pay for a custom Hotel Management System?"
                questionNumber={24}
                hint="One-time fee or monthly subscription"
              >
                <TextInput
                  value={formData.hmsMaxBudget}
                  onChange={(v) => updateField('hmsMaxBudget', v)}
                  placeholder="e.g., NPR 50,000 one-time or NPR 5,000/month"
                />
              </FormField>
            </SectionWrapper>
          </div>

          {/* SECTION 6: Dynamic Questions */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6">
            <SectionHeader
              number={6}
              title="Custom Questions"
              description="Add custom questions on-the-fly during live interviews."
              icon={<PlusCircle className="w-6 h-6 text-white" />}
            />

            {customQuestions.length > 0 && (
              <div className="space-y-4 mb-6">
                {customQuestions.map((q) => (
                  <CustomQuestionBlock
                    key={q.id}
                    question={q}
                    answer={formData.customAnswers[q.id] || ''}
                    onUpdateQuestion={(updated) => updateCustomQuestion(q.id, updated)}
                    onRemoveQuestion={() => removeCustomQuestion(q.id)}
                    onAnswerChange={(value) => updateCustomAnswer(q.id, value)}
                  />
                ))}
              </div>
            )}

            {customQuestions.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  <PlusCircle className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mb-1">No custom questions yet</p>
                <p className="text-xs text-slate-400">Click the button below to add questions during the interview</p>
              </div>
            )}

            <button
              type="button"
              onClick={addCustomQuestion}
              className="w-full py-4 border-2 border-dashed border-primary-300 rounded-2xl
                text-primary-600 font-semibold text-sm
                flex items-center justify-center gap-2
                hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700
                transition-all duration-200 group"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>+ Add Custom Question</span>
            </button>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-6">
                By submitting this survey, you agree that your responses will be used solely for market research purposes.
                All information is kept strictly confidential.
              </p>

              <button
                type="submit"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white
                  rounded-2xl font-bold text-base shadow-xl shadow-primary-200
                  hover:from-primary-700 hover:to-primary-800 hover:shadow-2xl hover:shadow-primary-300
                  active:scale-[0.98] transition-all duration-200 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Submit Survey Response
              </button>

              <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Your data is encrypted and secure
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-10 pb-4">
          <p className="text-xs text-slate-400">
            © 2025 Hotel Booking System — Market Research Survey for Kathmandu Hotels
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Built with ❤️ for the Nepali hospitality industry
          </p>
        </div>
      </div>
    </div>
  );
}
