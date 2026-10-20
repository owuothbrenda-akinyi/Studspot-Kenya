import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  Lock, 
  Mail, 
  Phone, 
  School, 
  CheckSquare, 
  Square, 
  PenTool, 
  GraduationCap,
  CheckCircle2,
  MailCheck,
  Send,
  Info,
  Sparkles
} from 'lucide-react';
import { User, InstitutionType } from '../types';
import { UNIVERSITIES } from '../data/seedData';
import { saveCustomCampus, getAllCampuses } from '../utils/campusStore';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserRegistered: (user: User) => void;
  onOpenTerms: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onUserRegistered,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Standard personal email (e.g., Gmail, Yahoo) or work
  const [studentEmail, setStudentEmail] = useState(''); // Optional student institutional email (.ac.ke)
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState('uon');
  const [campusName, setCampusName] = useState('Main Campus');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Institutional email confirmation link simulation
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);

  // Custom campus typing support
  const [isCustomCampus, setIsCustomCampus] = useState(false);
  const [customCampusName, setCustomCampusName] = useState('');
  const [customCampusZone, setCustomCampusZone] = useState('Main Campus');
  const [customInstitutionType, setCustomInstitutionType] = useState<InstitutionType>('university');

  const allAvailableCampuses = getAllCampuses();
  const selectedUni = allAvailableCampuses.find(u => u.id === universityId) || allAvailableCampuses[1] || UNIVERSITIES[1];

  // Helper: Detect whether an email is an institutional address (.ac.ke or .edu)
  const isInstitutionalEmail = (addr: string) => {
    if (!addr) return false;
    const clean = addr.trim().toLowerCase();
    return clean.endsWith('.ac.ke') || clean.includes('.ac.ke') || clean.endsWith('.edu') || clean.includes('students.');
  };

  const detectedInstitutionalEmail = isInstitutionalEmail(studentEmail)
    ? studentEmail.trim()
    : isInstitutionalEmail(email)
      ? email.trim()
      : '';

  const handleConfirmInstitutionalLink = () => {
    if (!detectedInstitutionalEmail) return;
    setIsConfirmingEmail(true);
    setTimeout(() => {
      setIsConfirmingEmail(false);
      setIsEmailConfirmed(true);
      setSuccessNotice(`Verification link confirmed for ${detectedInstitutionalEmail}! Your account will receive the "Verified Email" Comrade Badge.`);
    }, 600);
  };

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup') {
      // MANDATORY TERMS CONSENT CHECK:
      if (!agreedToTerms) {
        setErrorMsg('You must check and agree to the STUDSPOT Terms & Conditions to register an account.');
        return;
      }

      if (!fullName.trim() || !email.trim()) {
        setErrorMsg('Please fill in your legal name and primary personal email address.');
        return;
      }

      if (isCustomCampus && !customCampusName.trim()) {
        setErrorMsg('Please type your campus or college name.');
        return;
      }

      let finalUniId = universityId;
      let finalCampusName = campusName;

      if (isCustomCampus || universityId === 'other_custom') {
        const typedName = customCampusName.trim() || 'Custom Campus';
        const typedZone = customCampusZone.trim() || 'Main Campus';
        const createdUni = saveCustomCampus(typedName, customInstitutionType, typedZone);
        finalUniId = createdUni.id;
        finalCampusName = `${typedName} (${typedZone})`;
      }

      // Check if user has verified via institutional .ac.ke link
      const hasVerifiedInstitutionalEmail = isEmailConfirmed || !!detectedInstitutionalEmail;

      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(), // Standard personal email (e.g. Gmail/Yahoo) or whatever user typed
        studentEmail: studentEmail.trim() || (isInstitutionalEmail(email) ? email.trim() : undefined),
        phone: phone.trim() || '+254700000000',
        universityId: finalUniId,
        campusName: finalCampusName,
        studentRegNo: studentRegNo.trim() || undefined,
        role: 'student',
        agreedToTerms: true,
        createdAt: new Date().toISOString().split('T')[0],
        isVerifiedStudent: hasVerifiedInstitutionalEmail || !!studentRegNo.trim(),
        isEmailVerified: hasVerifiedInstitutionalEmail,
        emailVerifiedBadge: hasVerifiedInstitutionalEmail,
        verificationMethod: hasVerifiedInstitutionalEmail ? 'institutional_email' : (studentRegNo.trim() ? 'student_id_card' : 'none'),
        verificationStatus: hasVerifiedInstitutionalEmail ? 'verified' : (studentRegNo.trim() ? 'pending' : 'unverified'),
      };

      onUserRegistered(newUser);
      onClose();
    } else {
      // Login mode demo: Accepts any email (Gmail, Yahoo, .ac.ke, etc.)
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }

      const isInst = isInstitutionalEmail(email);

      const existingUser: User = {
        id: `usr-demo-${Date.now()}`,
        fullName: email.split('@')[0] || 'Comrade Student',
        email: email.trim(),
        studentEmail: isInst ? email.trim() : undefined,
        phone: '+254712345678',
        universityId: 'uon',
        campusName: 'Main Campus',
        role: email.includes('admin') ? 'admin' : 'student',
        agreedToTerms: true,
        createdAt: '2026-09-01',
        isVerifiedStudent: true,
        isEmailVerified: isInst,
        emailVerifiedBadge: isInst,
        verificationMethod: isInst ? 'institutional_email' : 'student_id_card',
        verificationStatus: 'verified',
      };

      onUserRegistered(existingUser);
      onClose();
    }
  };

  const handleQuickDemoUser = (role: 'student' | 'admin') => {
    const demoUser: User = {
      id: role === 'admin' ? 'usr-admin' : 'usr-demo-student',
      fullName: role === 'admin' ? 'STUDSPOT Platform Admin' : 'Faith Chebet (Comrade)',
      email: role === 'admin' ? 'admin@studspot.co.ke' : 'fchebet@gmail.com',
      studentEmail: role === 'student' ? 'fchebet@students.uonbi.ac.ke' : undefined,
      phone: '+254722998877',
      universityId: 'uon',
      campusName: 'Chiromo Campus',
      studentRegNo: role === 'student' ? 'F17/8241/2023' : undefined,
      role: role,
      agreedToTerms: true,
      createdAt: '2026-09-01',
      isVerifiedStudent: true,
      isEmailVerified: role === 'student',
      emailVerifiedBadge: role === 'student',
      verificationMethod: role === 'student' ? 'institutional_email' : 'none',
      verificationStatus: 'verified',
    };
    onUserRegistered(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
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
              <h2 className="text-base font-bold text-white font-heading">
                {mode === 'signup' ? 'Create STUDSPOT Account' : 'Welcome Back'}
              </h2>
              <p className="text-[11px] text-neutral-400">Campus Marketplace & Directory</p>
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
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'signup' ? (
            <>
              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Brenda Awuor"
                  className="w-full px-3.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                />
              </div>

              {/* Personal Email & M-Pesa Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-300">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">Personal / Standard</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. brenda@gmail.com or yahoo.com"
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Use any valid Gmail, Yahoo or Outlook. Signups are never blocked.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-300">
                      M-Pesa Phone <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] text-neutral-400 font-mono">+254</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none font-mono"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    For direct M-Pesa escrow payments & buyer inquiries.
                  </span>
                </div>
              </div>

              {/* Student / Institutional Email (Optional) */}
              <div className="p-3 bg-[#1F1F1F] rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#F3B71B]" />
                    <span>Student Institutional Email</span>
                    <span className="text-neutral-500 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <span className="text-[10px] bg-[#F3B71B]/20 text-[#F3B71B] font-mono px-1.5 py-0.2 rounded font-bold">
                    .ac.ke
                  </span>
                </div>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. bawuor@students.uonbi.ac.ke or @kisiiuniversity.ac.ke"
                  className="w-full px-3 py-2 text-xs bg-[#282828] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none font-mono"
                />
                <p className="text-[10px] text-neutral-400 leading-snug">
                  Only university students are issued institutional student emails. TVET & KMTC comrades can leave this blank! If entered, confirm the link below for an instant <strong>"Verified Email"</strong> badge.
                </p>

                {/* Live Institutional Email Link Confirmation Box */}
                {detectedInstitutionalEmail ? (
                  <div className="mt-2 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Institutional Email Detected
                      </span>
                      {isEmailConfirmed ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Link Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-300/80 font-mono">Eligible for Badge</span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-300">
                      {isEmailConfirmed ? (
                        <span className="text-emerald-300">
                          Verification link confirmed for <strong className="font-mono text-white">{detectedInstitutionalEmail}</strong>! The official <strong>"Verified Email"</strong> Comrade Badge is ready.
                        </span>
                      ) : (
                        <span>
                          Confirm link for <strong className="font-mono text-white">{detectedInstitutionalEmail}</strong> to automatically grant your account the <strong>"Verified Email"</strong> badge!
                        </span>
                      )}
                    </p>

                    {!isEmailConfirmed && (
                      <button
                        type="button"
                        onClick={handleConfirmInstitutionalLink}
                        disabled={isConfirmingEmail}
                        className="w-full py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MailCheck className="w-3.5 h-3.5" />
                        <span>{isConfirmingEmail ? 'Confirming Link...' : 'Confirm Institutional Email Link Now'}</span>
                      </button>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Personal Email reassurance info pill */}
              {!detectedInstitutionalEmail && email.trim() && (
                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2 text-xs text-neutral-400">
                  <Info className="w-3.5 h-3.5 text-[#F3B71B] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    Personal email accepted (<strong className="text-neutral-200">{email}</strong>). You can easily verify your Comrade status later using your Student Reg Number if it matches your uploaded Student ID Card.
                  </span>
                </div>
              )}

              {/* Institution Selection or Custom Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300">
                    Campus / Institution <span className="text-[#F3B71B]">*</span>
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
                    <span>{isCustomCampus ? "← Standard List" : "Can't find campus? Type it"}</span>
                  </button>
                </div>

                {isCustomCampus ? (
                  <div className="bg-[#1F1F1F] border border-[#F3B71B]/50 rounded-2xl p-3 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#F3B71B] flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Type Your Campus
                      </span>
                      <span className="text-[10px] text-neutral-400">e.g. KSII uni, Zetech...</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          required={isCustomCampus}
                          value={customCampusName}
                          onChange={(e) => setCustomCampusName(e.target.value)}
                          placeholder="e.g. KSII uni / Kisii Uni"
                          className="w-full px-2.5 py-1.5 text-xs bg-[#282828] text-white rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none"
                        />
                      </div>
                      <div>
                        <select
                          value={customInstitutionType}
                          onChange={(e) => setCustomInstitutionType(e.target.value as any)}
                          className="w-full px-2 py-1.5 text-xs bg-[#282828] text-white rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none"
                        >
                          <option value="university">🎓 University</option>
                          <option value="kmtc">🩺 KMTC</option>
                          <option value="polytechnic">⚙️ Poly</option>
                          <option value="tvet">🔧 TVET</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={customCampusZone}
                        onChange={(e) => setCustomCampusZone(e.target.value)}
                        placeholder="Campus Wing/Gate (e.g. Main Campus, Town Campus)"
                        className="w-full px-2.5 py-1.5 text-xs bg-[#282828] text-white rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <select
                        value={universityId}
                        onChange={(e) => handleUniversityChange(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                      >
                        <optgroup label="✨ Not in list?">
                          <option value="other_custom">✍️ Type Custom Campus...</option>
                        </optgroup>
                        <optgroup label="🎓 Public & Private Universities">
                          {allAvailableCampuses.filter(u => u.institutionType === 'university').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.name} ({uni.shortName})</option>
                          ))}
                        </optgroup>
                        <optgroup label="🩺 KMTC Campuses">
                          {allAvailableCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="⚙️ National Polytechnics">
                          {allAvailableCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🔧 TVETs, TTIs & Specialized Colleges">
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
                        className="w-full px-2.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none truncate"
                      >
                        {selectedUni.campuses.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Student Reg Number <span className="text-neutral-500 font-normal">(Optional for verification)</span>
                </label>
                <input
                  type="text"
                  value={studentRegNo}
                  onChange={(e) => setStudentRegNo(e.target.value)}
                  placeholder="e.g. F17/8241/2023"
                  className="w-full px-3.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none font-mono"
                />
              </div>

              {/* MANDATORY TERMS & CONDITIONS CHECKBOX */}
              <div className="pt-2 border-t border-neutral-800">
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#242424] border border-neutral-700 cursor-pointer hover:border-[#F3B71B]/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#F3B71B] accent-[#F3B71B] focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs text-neutral-300 leading-snug">
                    <span className="font-semibold text-white">
                      I agree to the STUDSPOT Terms & Conditions
                    </span>{' '}
                    including the Directory Intermediary Disclaimer, Limitation of Liability Waiver, and Non-Refundable KSh 80 listing fee.{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenTerms();
                      }}
                      className="text-[#F3B71B] underline font-bold hover:text-white"
                    >
                      Read Terms & Disclaimers
                    </button>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@students.uonbi.ac.ke"
                  className="w-full px-3.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs shadow-lg shadow-[#F3B71B]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-3"
          >
            <UserCheck className="w-4 h-4" />
            <span>{mode === 'signup' ? 'Complete Registration' : 'Log In to STUDSPOT'}</span>
          </button>

          {/* Mode Switcher */}
          <div className="text-center pt-2">
            {mode === 'signup' ? (
              <p className="text-xs text-neutral-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#F3B71B] font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#F3B71B] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins for easy evaluation */}
          <div className="pt-3 border-t border-neutral-800 text-center">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-2">
              Quick Evaluator Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoUser('student')}
                className="py-1.5 px-2 bg-[#242424] hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors border border-neutral-700"
              >
                🎓 Student Comrade
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser('admin')}
                className="py-1.5 px-2 bg-[#F3B71B]/10 hover:bg-[#F3B71B]/20 text-[#F3B71B] font-semibold text-xs rounded-lg transition-colors border border-[#F3B71B]/30"
              >
                ⚡ Platform Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
