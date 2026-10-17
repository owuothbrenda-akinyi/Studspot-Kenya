import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  Check, 
  Sparkles,
  ShoppingBag,
  Home,
  Briefcase,
  Store,
  CreditCard,
  ShieldAlert,
  GraduationCap,
  PenTool
} from 'lucide-react';
import { Listing, ListingType, University, User, InstitutionType } from '../types';
import { UNIVERSITIES, SAFE_MEETUP_SPOTS } from '../data/seedData';
import { saveCustomCampus, getAllCampuses } from '../utils/campusStore';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: Listing) => void;
  currentUser: User | null;
  onOpenTerms: () => void;
}

const STOCK_PHOTOS: Record<ListingType, { label: string; url: string }[]> = {
  item: [
    { label: 'Electronics & Laptops', url: '/src/assets/images/student_cyber_tech_1791796604735.jpg' },
    { label: 'Campus Thrift Drip', url: '/src/assets/images/campus_thrift_fashion_1791796594005.jpg' },
    { label: 'Textbooks & Books', url: '/src/assets/images/hero_campus_marketplace_1791796569675.jpg' },
  ],
  hostel: [
    { label: 'Furnished Bedsitter', url: '/src/assets/images/hostel_student_room_1791796581832.jpg' },
    { label: 'Single Study Room', url: '/src/assets/images/hostel_student_room_1791796581832.jpg' },
  ],
  gig: [
    { label: 'Academic & Writing Work', url: '/src/assets/images/student_cyber_tech_1791796604735.jpg' },
    { label: 'Campus Promo & Brand', url: '/src/assets/images/hero_campus_marketplace_1791796569675.jpg' },
  ],
  business: [
    { label: 'Hostel Food & Delivery', url: '/src/assets/images/campus_thrift_fashion_1791796594005.jpg' },
    { label: 'Tech & Phone Repair', url: '/src/assets/images/student_cyber_tech_1791796604735.jpg' },
  ]
};

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  currentUser,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<ListingType>('item');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [category, setCategory] = useState('Textbooks');
  const [universityId, setUniversityId] = useState(currentUser?.universityId || 'uon');
  const [campusName, setCampusName] = useState(currentUser?.campusName || 'Main Campus');
  const [sellerName, setSellerName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '');
  const [courseOrBiz, setCourseOrBiz] = useState(currentUser?.studentRegNo ? `Reg: ${currentUser.studentRegNo}` : '');
  const [tillNumber, setTillNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState(STOCK_PHOTOS.item[0].url);
  const [safeSpot, setSafeSpot] = useState('Main Campus Fountain & Library');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Hostel specific fields
  const [hostelType, setHostelType] = useState('Bedsitter');
  const [distanceToGate, setDistanceToGate] = useState('4 mins walk');
  const [waterStatus, setWaterStatus] = useState('Borehole 24/7');
  const [electricityType, setElectricityType] = useState('Prepaid Token');

  // Gig specific fields
  const [gigDuration, setGigDuration] = useState('2 Days');
  const [compensationType, setCompensationType] = useState<'Per Task' | 'Per Hour' | 'Per Day' | 'Monthly'>('Per Task');

  // Custom campus typing support
  const [isCustomCampus, setIsCustomCampus] = useState(false);
  const [customCampusName, setCustomCampusName] = useState('');
  const [customCampusZone, setCustomCampusZone] = useState('Main Campus');
  const [customInstitutionType, setCustomInstitutionType] = useState<InstitutionType>('university');

  const allAvailableCampuses = getAllCampuses();
  const selectedUniObj = allAvailableCampuses.find(u => u.id === universityId) || allAvailableCampuses[1] || UNIVERSITIES[1];

  const handleUniversityChange = (id: string) => {
    if (id === 'other_custom') {
      setIsCustomCampus(true);
      setUniversityId('other_custom');
      return;
    }
    setIsCustomCampus(false);
    setUniversityId(id);
    const uni = allAvailableCampuses.find(u => u.id === id);
    if (uni && uni.campuses.length > 0) {
      setCampusName(uni.campuses[0]);
    }
    const spots = SAFE_MEETUP_SPOTS[id];
    if (spots && spots.length > 0) {
      setSafeSpot(spots[0]);
    }
  };

  const handleTypeChange = (newType: ListingType) => {
    setType(newType);
    setSelectedImage(STOCK_PHOTOS[newType][0].url);
    if (newType === 'item') setCategory('Marketplace');
    if (newType === 'hostel') setCategory('Housing (Hostels)');
    if (newType === 'gig') setCategory('Jobs (Gigs)');
    if (newType === 'business') setCategory('Services');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !sellerName.trim()) {
      return;
    }

    if (isCustomCampus && !customCampusName.trim()) {
      return;
    }

    const priceNum = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const finalImage = customPhotoUrl.trim() || selectedImage;

    let finalUniId = universityId;
    let finalCampusName = campusName;
    let finalInstType = selectedUniObj.institutionType || 'university';

    if (isCustomCampus || universityId === 'other_custom') {
      const typedName = customCampusName.trim() || 'Custom Campus';
      const typedZone = customCampusZone.trim() || 'Main Campus';
      const createdUni = saveCustomCampus(typedName, customInstitutionType, typedZone);
      finalUniId = createdUni.id;
      finalCampusName = `${typedName} (${typedZone})`;
      finalInstType = customInstitutionType;
    }

    // MANDATORY ADALO PROPERTY: isApproved set to Default: False across all listing collections!
    const newListing: Listing = {
      id: `${type}-${Date.now()}`,
      type,
      title: title.trim(),
      description: description.trim() || 'No additional details provided. Contact seller for inquiries.',
      price: priceNum,
      priceLabel: type === 'hostel' ? '/month' : type === 'gig' ? `/${compensationType.toLowerCase()}` : '',
      isNegotiable,
      category,
      image: finalImage,
      universityId: finalUniId,
      campusName: finalCampusName,
      institutionType: finalInstType,
      seller: {
        name: sellerName.trim(),
        role: type === 'hostel' ? 'hostel_caretaker' : type === 'business' ? 'student_freelancer' : 'student',
        courseOrBiz: courseOrBiz.trim() || (type === 'hostel' ? 'Hostel Caretaker' : 'Student Comrade'),
        phone: phone.trim() || '+254700000000',
        whatsapp: whatsapp.trim() || phone.trim() || '254700000000',
        isVerifiedStudent: !!currentUser?.isVerifiedStudent,
        trustScore: 98,
        reviewsCount: 1,
        safeSpot,
        tillNumber: tillNumber.trim() ? tillNumber.trim() : undefined,
      },
      details: {
        condition: type === 'item' ? 'Good Condition' : undefined,
        hostelType: type === 'hostel' ? (hostelType as any) : undefined,
        distanceToGate: type === 'hostel' ? distanceToGate : undefined,
        waterStatus: type === 'hostel' ? waterStatus : undefined,
        electricityType: type === 'hostel' ? electricityType : undefined,
        gigDuration: type === 'gig' ? gigDuration : undefined,
        compensationType: type === 'gig' ? compensationType : undefined,
        openingHours: type === 'business' ? '8:00 AM - 8:00 PM' : undefined,
        deliveryAvailable: type === 'business',
      },
      
      // CRITICAL ADALO DATABASE PROPERTIES:
      isApproved: false, // DEFAULT: FALSE (blocks public display until admin approval)
      isFeePaid: false,  // Awaiting KSh 80 fee payment
      listingFeeKsh: 80,
      
      createdAt: 'Just now',
      viewsCount: 0,
      likesCount: 0,
      featured: false,
    };

    onAddListing(newListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-neutral-950 border border-[#F3B71B]/50 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/studspot-gold-icon.png"
                alt="STUDSPOT Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">Post on STUDSPOT</h2>
              <p className="text-[11px] text-neutral-400">Campus Marketplace, Housing, Gigs & Services</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4 text-xs sm:text-sm">
          {/* Fee Notice Banner */}
          <div className="p-3 bg-[#242424] rounded-2xl border border-[#F3B71B]/30 flex items-start gap-2.5 text-xs text-neutral-300">
            <CreditCard className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Non-Refundable KSh 80 / Month Listing Fee:</span>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
                Submissions are created with <code className="text-[#F3B71B]">isApproved: False</code>. Upon submission, you will be redirected to the M-Pesa instructions screen to pay the KSh 80 fee before administrative approval.
              </p>
            </div>
          </div>

          {/* Listing Category Chips */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Select Collection
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('item')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all ${
                  type === 'item'
                    ? 'bg-[#F3B71B]/15 border-[#F3B71B] text-[#F3B71B] shadow-sm'
                    : 'bg-[#242424] border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Marketplace</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('hostel')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all ${
                  type === 'hostel'
                    ? 'bg-[#F3B71B]/15 border-[#F3B71B] text-[#F3B71B] shadow-sm'
                    : 'bg-[#242424] border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Housing</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('gig')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all ${
                  type === 'gig'
                    ? 'bg-[#F3B71B]/15 border-[#F3B71B] text-[#F3B71B] shadow-sm'
                    : 'bg-[#242424] border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs (Gigs)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('business')}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition-all ${
                  type === 'business'
                    ? 'bg-[#F3B71B]/15 border-[#F3B71B] text-[#F3B71B] shadow-sm'
                    : 'bg-[#242424] border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Services</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Title <span className="text-[#F3B71B]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'item'
                  ? 'e.g. Calculus & Linear Algebra Textbook (Stroud)'
                  : type === 'hostel'
                  ? 'e.g. Sunset Executive Bedsitter near Gate C'
                  : type === 'gig'
                  ? 'e.g. Urgent: Academic Thesis Formatting & APA 7th Referencing'
                  : 'e.g. Mama Stacy Hostel Food Express (Hot Chapati Delivery)'
              }
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
            />
          </div>

          {/* University & Campus selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300">
                Target Campus <span className="text-[#F3B71B]">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCampus(!isCustomCampus);
                  if (!isCustomCampus && !customCampusName) {
                    setCustomCampusName('');
                  }
                }}
                className="text-[11px] text-[#F3B71B] hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                <PenTool className="w-3 h-3" />
                <span>{isCustomCampus ? "← Choose from standard list" : "Campus not listed? Type your campus"}</span>
              </button>
            </div>

            {isCustomCampus ? (
              /* Custom Campus Manual Entry Box */
              <div className="bg-[#1C1C1C] border-2 border-[#F3B71B]/50 rounded-2xl p-3.5 space-y-3 shadow-md animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3B71B] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#F3B71B]" />
                    Type Your Campus Name
                  </span>
                  <span className="text-[10px] bg-[#F3B71B]/15 text-[#F3B71B] px-2 py-0.5 rounded font-mono font-bold">
                    Custom Campus
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Campus / Institution Name <span className="text-[#F3B71B]">*</span>
                    </label>
                    <input
                      type="text"
                      required={isCustomCampus}
                      value={customCampusName}
                      onChange={(e) => setCustomCampusName(e.target.value)}
                      placeholder="e.g. KSII uni, Zetech, KCA, Maasai Mara..."
                      className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Type your university, KMTC, poly, or college if it is not in the list.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Institution Category
                    </label>
                    <select
                      value={customInstitutionType}
                      onChange={(e) => setCustomInstitutionType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                    >
                      <option value="university">🎓 University</option>
                      <option value="kmtc">🩺 KMTC Campus</option>
                      <option value="polytechnic">⚙️ National Polytechnic</option>
                      <option value="tvet">🔧 TVET Institute / College</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Campus Zone / Gate / Area
                  </label>
                  <input
                    type="text"
                    value={customCampusZone}
                    onChange={(e) => setCustomCampusZone(e.target.value)}
                    placeholder="e.g. Main Campus, Mwembe Gate, Town Wing, Hostel Zone..."
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                  />
                </div>
              </div>
            ) : (
              /* Standard Dropdown Select */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select
                    value={universityId}
                    onChange={(e) => handleUniversityChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                  >
                    <optgroup label="✨ Not in list?">
                      <option value="other_custom">✍️ Type Custom Campus Name (e.g. KSII uni...)</option>
                    </optgroup>
                    <optgroup label="Universities">
                      {allAvailableCampuses.filter(u => u.institutionType === 'university').map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="KMTC (Kenya Medical Training College)">
                      {allAvailableCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="National Polytechnics">
                      {allAvailableCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="TVET Colleges & Institutes">
                      {allAvailableCampuses.filter(u => u.institutionType === 'tvet').map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <select
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                  >
                    {selectedUniObj.campuses.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Price & Negotiation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Price (KES) <span className="text-[#F3B71B]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">KES</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-12 pr-3 py-2 text-xs sm:text-sm font-mono font-bold bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 text-xs font-medium text-neutral-300 bg-[#242424] rounded-xl border border-neutral-700 cursor-pointer hover:border-neutral-600">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F3B71B] accent-[#F3B71B]"
                />
                <span>Price Negotiable</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State condition, specs, hostel water/power rules, or gig requirements..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
            />
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Photo Representation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STOCK_PHOTOS[type].map((photo, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedImage(photo.url); setCustomPhotoUrl(''); }}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                    selectedImage === photo.url && !customPhotoUrl
                      ? 'border-[#F3B71B] ring-2 ring-[#F3B71B]/30'
                      : 'border-neutral-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-bold text-white leading-tight">{photo.label}</span>
                  </div>
                  {selectedImage === photo.url && !customPhotoUrl && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#F3B71B] text-black font-bold flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safe Meetup Spot */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F3B71B]" />
              <span>Campus Meetup Spot</span>
            </label>
            <input
              type="text"
              value={safeSpot}
              onChange={(e) => setSafeSpot(e.target.value)}
              placeholder="e.g. Main Library Gate, Student Center Cafeteria"
              className="w-full px-3.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
            />
          </div>

          {/* Contact Details */}
          <div className="bg-[#242424] p-3.5 rounded-2xl border border-neutral-700 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Seller Contact Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Brenda Awuor"
                  className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg border border-neutral-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Phone / Call</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg border border-neutral-800 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="254712345678"
                  className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg border border-neutral-800 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Faculty / Course</label>
                <input
                  type="text"
                  value={courseOrBiz}
                  onChange={(e) => setCourseOrBiz(e.target.value)}
                  placeholder="e.g. BSc. Software Engineering Year 3"
                  className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg border border-neutral-800 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-neutral-400">
                    M-Pesa Buy Goods / Till Number (Optional)
                  </label>
                  <span className="text-[10px] text-[#F3B71B] font-mono">Accepts instant comrade payments</span>
                </div>
                <input
                  type="text"
                  value={tillNumber}
                  onChange={(e) => setTillNumber(e.target.value)}
                  placeholder="1823325"
                  className="w-full px-3 py-1.5 text-xs bg-[#1A1A1A] text-white rounded-lg border border-neutral-800 outline-none font-mono focus:border-[#F3B71B] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Legal Reminder before submission */}
          <div className="text-[11px] text-neutral-400 leading-snug">
            By submitting, you agree to the{' '}
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-[#F3B71B] underline font-bold"
            >
              STUDSPOT Terms & Conditions
            </button>
            . No stolen goods or academic fraud services.
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs shadow-lg shadow-[#F3B71B]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Submit Listing & Proceed to M-Pesa Instructions (KSh 80)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
