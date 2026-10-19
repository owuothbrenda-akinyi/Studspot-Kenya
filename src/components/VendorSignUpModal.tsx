import React, { useState, useRef } from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail, 
  User as UserIcon, 
  FileText, 
  RotateCcw, 
  Lock, 
  Sparkles,
  Clock,
  Building2
} from 'lucide-react';
import { VendorCategory, Vendor } from '../types';
import { getAllCampuses } from '../utils/campusStore';
import { registerVendor, validateKenyanPhone } from '../utils/verificationStore';

interface VendorSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorRegistered: (vendor: Vendor) => void;
}

const VENDOR_CATEGORIES: { id: VendorCategory; label: string; desc: string }[] = [
  { id: 'Food & Dining', label: 'Food & Campus Dining', desc: 'Kibanda meals, fast food, bakery & chapati delivery' },
  { id: 'Printing & Cyber', label: 'Printing & Cyber Cafe', desc: 'Printing, binding, thesis typing & photocopying' },
  { id: 'Accommodation', label: 'Hostels & Student Housing', desc: 'Bedsitters, single rooms & apartment caretakers' },
  { id: 'Retail & Groceries', label: 'Retail & Campus Groceries', desc: 'Mini-marts, gas cylinder refills & personal supplies' },
  { id: 'Tech & Phone Repair', label: 'Tech, Laptop & Phone Repair', desc: 'Screen replacements, accessories & electronics' },
  { id: 'Fashion & Thrift', label: 'Campus Thrift & Fashion', desc: 'Student apparel, sneakers & custom printing' },
  { id: 'Other Services', label: 'Other Campus Services', desc: 'Photography, laundry, salon/barbershop & event sound' },
];

export const VendorSignUpModal: React.FC<VendorSignUpModalProps> = ({
  isOpen,
  onClose,
  onVendorRegistered,
}) => {
  if (!isOpen) return null;

  const allCampuses = getAllCampuses();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Food & Dining');
  const [locationDescription, setLocationDescription] = useState('');
  const [nearestCampusId, setNearestCampusId] = useState('jkuat');
  const [contactPersonName, setContactPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // National ID Document
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
  );
  const [fileName, setFileName] = useState<string>('National_ID_Card.pdf');
  const [fileSizeMb, setFileSizeMb] = useState<number>(1.8);
  const [isPdf, setIsPdf] = useState<boolean>(true);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedVendor, setSubmittedVendor] = useState<Vendor | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 5) {
      setErrorMsg(`Document size (${sizeInMb.toFixed(1)}MB) exceeds the 5MB maximum limit.`);
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Accepted formats: PNG, JPG, or PDF.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeMb(parseFloat(sizeInMb.toFixed(2)));
    setIsPdf(file.type === 'application/pdf');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    setFileName('');
    setFileSizeMb(0);
    setIsPdf(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!legalBusinessName.trim()) {
      setErrorMsg('Please enter your legal business name.');
      return;
    }

    if (!locationDescription.trim()) {
      setErrorMsg('Please enter your physical location description (e.g., Gate C opposite Quickmart).');
      return;
    }

    if (!contactPersonName.trim()) {
      setErrorMsg('Please enter the contact person name.');
      return;
    }

    // Validate Kenyan Phone Number formatting
    const phoneCheck = validateKenyanPhone(phone);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.error || 'Please enter a valid Kenyan phone number (e.g. +254712345678 or 0712345678).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!filePreview && !selectedFile) {
      setErrorMsg('Please upload your National ID Card or Business Permit.');
      return;
    }

    const campusObj = allCampuses.find(u => u.id === nearestCampusId) || allCampuses[1];

    setIsSubmitting(true);

    try {
      const res = await registerVendor({
        legalBusinessName: legalBusinessName.trim(),
        category,
        locationDescription: locationDescription.trim(),
        nearestCampusId,
        nearestCampusName: `${campusObj.name} (${campusObj.shortName})`,
        contactPersonName: contactPersonName.trim(),
        phone: phoneCheck.formatted,
        email: email.trim().toLowerCase(),
        nationalIdDocUrl: filePreview || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        nationalIdDocName: fileName || 'National_ID_Card.jpg'
      });

      setSubmittedVendor(res.vendor);
      onVendorRegistered(res.vendor);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3B71B]/15 border border-[#F3B71B]/40 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#F3B71B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">Campus Vendor Registration</h2>
                <span className="text-[10px] bg-[#F3B71B] text-black font-mono px-2 py-0.5 rounded-full font-black">
                  Merchant
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Join the verified student directory to reach 500,000+ comrades
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {submittedVendor ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/60">
                <Clock className="w-9 h-9 text-amber-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-heading">
                  Vendor Application Submitted!
                </h3>
                <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Profile State: status = "review"
                </span>
                <p className="text-xs text-neutral-300 max-w-md mx-auto pt-2">
                  Welcome aboard, <strong className="text-white">{submittedVendor.legalBusinessName}</strong>! Your merchant account is stored in the isolated <code className="text-[#F3B71B] font-mono">vendors</code> database collection.
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-2.5 max-w-md mx-auto text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Nearest Campus:</span>
                  <span className="font-bold text-white">{submittedVendor.nearestCampusName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Contact Number:</span>
                  <span className="font-mono text-emerald-400">{submittedVendor.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Physical Location:</span>
                  <span className="text-neutral-200">{submittedVendor.locationDescription}</span>
                </div>
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                  🔒 <strong>Verification Rule:</strong> Product and service uploads will unlock as soon as your business verification is reviewed and approved by the campus administration.
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-sm transition shadow-md"
              >
                Go to Vendor Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Legal Business Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Legal Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={legalBusinessName}
                  onChange={(e) => setLegalBusinessName(e.target.value)}
                  placeholder="e.g., Mama Oliech Campus Meals & Catering"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                  required
                />
              </div>

              {/* 2. Business Category */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Business Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VendorCategory)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                >
                  {VENDOR_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Nearest University Campus Served */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Nearest University / College Served <span className="text-rose-400">*</span>
                </label>
                <select
                  value={nearestCampusId}
                  onChange={(e) => setNearestCampusId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                >
                  <optgroup label="🎓 Public & Private Universities">
                    {allCampuses.filter(u => u.id !== 'all' && u.institutionType === 'university').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} ({uni.shortName}) - {uni.city}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🩺 KMTC Medical Campuses">
                    {allCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} - {uni.city}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="⚙️ National Polytechnics">
                    {allCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} - {uni.city}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🔧 TVETs, TTIs & Specialized Colleges">
                    {allCampuses.filter(u => u.institutionType === 'tvet').map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name} - {uni.city}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 4. Physical Location Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Physical Location Description <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-neutral-400">Clear landmarks for students</span>
                </label>
                <input
                  type="text"
                  value={locationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                  placeholder="e.g., Gate C Container Stall #14 opposite QuickMart"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                  required
                />
              </div>

              {/* 5. Contact Person Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Contact Person Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactPersonName}
                    onChange={(e) => setContactPersonName(e.target.value)}
                    placeholder="e.g., Mary Atieno Oliech"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                    required
                  />
                </div>

                {/* 6. Phone Number (Kenyan Format Validation) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Phone / M-Pesa Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254712345678 or 0712345678"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white font-mono rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* 7. Email Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., business@campusvendor.co.ke"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none transition"
                  required
                />
              </div>

              {/* 8. National ID or Business Permit Upload Section */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-200 mb-1 flex items-center justify-between">
                  <span>Upload National ID Card or Business Permit <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-neutral-400">PNG, JPG, PDF (Max 5MB)</span>
                </label>

                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="hidden"
                />

                {filePreview || isPdf ? (
                  <div className="relative rounded-2xl bg-neutral-900 border border-neutral-700 p-3 flex items-center justify-between gap-3 overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      {isPdf ? (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0">
                          <img 
                            src={filePreview} 
                            alt="Document Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{fileName || 'National_ID_Permit'}</p>
                        <p className="text-[10px] text-neutral-400">
                          {fileSizeMb ? `${fileSizeMb} MB · ` : ''}Document ready for verification review
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-1 shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-[#F3B71B]/70 bg-neutral-900/60 hover:bg-neutral-900 rounded-2xl p-6 text-center cursor-pointer transition space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-neutral-800 group-hover:bg-[#F3B71B]/20 text-neutral-400 group-hover:text-[#F3B71B] flex items-center justify-center mx-auto transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#F3B71B] transition">
                        Tap to upload National ID or County Business Permit
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        PNG, JPG, or PDF (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Isolation Notice */}
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-400">
                <Lock className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
                <span>
                  Vendors are stored in a dedicated, isolated <code className="text-[#F3B71B]">vendors</code> schema. Products and services can be listed only once your account moves from <strong>status: "review"</strong> to <strong>status: "verified"</strong>.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-sm transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering Vendor Profile...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Submit Vendor Application (Enter Review State)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
