import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Upload, School, AlertCircle } from 'lucide-react';
import { UNIVERSITIES } from '../data/seedData';
import { getAllCampuses } from '../utils/campusStore';

interface StudentVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVerifiedStudent: boolean;
  onVerifySuccess: () => void;
}

export const StudentVerifyModal: React.FC<StudentVerifyModalProps> = ({
  isOpen,
  onClose,
  isVerifiedStudent,
  onVerifySuccess,
}) => {
  if (!isOpen) return null;

  const allCampuses = getAllCampuses();
  const [regNo, setRegNo] = useState('IN11/0024/2023');
  const [studentEmail, setStudentEmail] = useState('comrade@kisiiuniversity.ac.ke');
  const [universityId, setUniversityId] = useState('kisii_uni');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onVerifySuccess();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-emerald-800 text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="text-lg font-bold font-heading">Comrade ID Verification</h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Get the green verified badge to build 100% trust with buyers & sellers
          </p>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Verified!</h3>
            <p className="text-xs text-slate-500">
              Your comrade trust badge is now active across all your listings, bids, and hostel inquiries.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Institution / College</label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              >
                <optgroup label="Universities">
                  {allCampuses.filter(u => u.institutionType === 'university').map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name} ({uni.shortName})</option>
                  ))}
                </optgroup>
                <optgroup label="KMTC (Kenya Medical Training College)">
                  {allCampuses.filter(u => u.institutionType === 'kmtc').map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </optgroup>
                <optgroup label="National Polytechnics">
                  {allCampuses.filter(u => u.institutionType === 'polytechnic').map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </optgroup>
                <optgroup label="TVET Colleges & Institutes">
                  {allCampuses.filter(u => u.institutionType === 'tvet').map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Registration / Admission No.
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. F17/8241/2023 or C025-01-0942/2022"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 font-mono rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional Student Email (.ac.ke)
              </label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="name@students.uonbi.ac.ke"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-slate-100/70 transition-colors">
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-slate-700">Upload or Snap Student ID Card</div>
              <p className="text-[10px] text-slate-400 mt-0.5">JPG or PNG (Exam card or student portal screenshot accepted)</p>
            </div>

            <div className="text-[11px] text-slate-500 flex items-start gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Verification keeps scam artists away from campus gates. Your registration details are kept strictly private.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying Student Portal...' : 'Confirm Student Verification'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
