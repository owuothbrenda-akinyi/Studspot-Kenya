import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, AlertCircle, Lock, Mail, Phone, School, CheckSquare, Square, PenTool, GraduationCap } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState('uon');
  const [campusName, setCampusName] = useState('Main Campus');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom campus typing support
  const [isCustomCampus, setIsCustomCampus] = useState(false);
  const [customCampusName, setCustomCampusName] = useState('');
  const [customCampusZone, setCustomCampusZone] = useState('Main Campus');
  const [customInstitutionType, setCustomInstitutionType] = useState<InstitutionType>('university');

  const allAvailableCampuses = getAllCampuses();
  const selectedUni = allAvailableCampuses.find(u => u.id === universityId) || allAvailableCampuses[1] || UNIVERSITIES[1];

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
        setErrorMsg('Please fill in your name and email address.');
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

      const newUser: User = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || '+254700000000',
        universityId: finalUniId,
        campusName: finalCampusName,
        studentRegNo: studentRegNo.trim() || undefined,
        role: 'student',
        agreedToTerms: true,
        createdAt: new Date().toISOString().split('T')[0],
        isVerifiedStudent: !!studentRegNo.trim(),
      };

      onUserRegistered(newUser);
      onClose();
    } else {
      // Login mode demo
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }

      const existingUser: User = {
        id: `usr-demo-${Date.now()}`,
        fullName: email.split('@')[0] || 'Comrade Student',
        email: email.trim(),
        phone: '+254712345678',
        universityId: 'uon',
        campusName: 'Main Campus',
        role: email.includes('admin') ? 'admin' : 'student',
        agreedToTerms: true,
        createdAt: '2026-09-01',
        isVerifiedStudent: true,
      };

      onUserRegistered(existingUser);
      onClose();
    }
  };

  const handleQuickDemoUser = (role: 'student' | 'admin') => {
    const demoUser: User = {
      id: role === 'admin' ? 'usr-admin' : 'usr-demo-student',
      fullName: role === 'admin' ? 'STUDSPOT Platform Admin' : 'Faith Chebet (Comrade)',
      email: role === 'admin' ? 'admin@studspot.co.ke' : 'fchebet@students.uonbi.ac.ke',
      phone: '+254722998877',
      universityId: 'uon',
      campusName: 'Chiromo Campus',
      studentRegNo: role === 'student' ? 'F17/8241/2023' : undefined,
      role: role,
      agreedToTerms: true,
      createdAt: '2026-09-01',
      isVerifiedStudent: true,
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
                src="/src/assets/images/studspot_gold_icon_1792275165524.jpg"
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">Student / Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@students.uonbi.ac.ke"
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">M-Pesa Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full px-3 py-2 text-xs bg-[#242424] text-white rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none font-mono"
                  />
                </div>
              </div>

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
                        <optgroup label="Universities">
                          {allAvailableCampuses.filter(u => u.institutionType === 'university').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.shortName}</option>
                          ))}
                        </optgroup>
                        <optgroup label="KMTC Campuses">
                          {allAvailableCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.shortName}</option>
                          ))}
                        </optgroup>
                        <optgroup label="National Polytechnics">
                          {allAvailableCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.shortName}</option>
                          ))}
                        </optgroup>
                        <optgroup label="TVET Colleges">
                          {allAvailableCampuses.filter(u => u.institutionType === 'tvet').map((uni) => (
                            <option key={uni.id} value={uni.id}>{uni.shortName}</option>
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
