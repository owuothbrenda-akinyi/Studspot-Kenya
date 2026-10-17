import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [justInstalled, setJustInstalled] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#181818] border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-white space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-neutral-950 border-2 border-[#F3B71B]/60 shadow-xl shadow-amber-950/40 shrink-0 flex items-center justify-center">
            <img
              src="/src/assets/images/studspot_gold_icon_1792275165524.jpg"
              alt="STUDSPOT Icon"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black tracking-tight text-white font-heading">
                STUDSPOT
              </h3>
              <span className="text-[9px] font-bold text-black bg-[#F3B71B] px-1.5 py-0.2 rounded font-mono">
                PWA APP
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Campus Marketplace & Community
            </p>
          </div>
        </div>

        {/* Benefits bullets */}
        <div className="bg-[#202020] rounded-2xl p-3.5 border border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fast 1-tap launch from your phone home screen</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-[#F3B71B] shrink-0" />
            <span>Standalone full-screen experience with zero URL bars</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Offline cached browsing & low data usage on campus Wi-Fi</span>
          </div>
        </div>

        {/* Actions / Instructions based on state */}
        {justInstalled ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-center space-y-1">
            <p className="text-sm font-bold text-emerald-400">🎉 Installed Successfully!</p>
            <p className="text-xs text-neutral-300">You can now open STUDSPOT directly from your home screen.</p>
          </div>
        ) : isInstalled ? (
          <div className="p-4 bg-[#242424] border border-neutral-700 rounded-2xl text-center space-y-1">
            <p className="text-sm font-bold text-[#F3B71B]">✓ Already Running in App Mode</p>
            <p className="text-xs text-neutral-400">STUDSPOT is active on your device.</p>
          </div>
        ) : isInstallable ? (
          <div className="space-y-3">
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#F3B71B] to-[#e5a80f] text-black font-extrabold text-sm rounded-xl hover:opacity-95 transition shadow-lg shadow-[#F3B71B]/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Home Screen (Install)</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400">
              Instant install · No App Store or Google Play download required
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Specific Guide */
          <div className="p-4 bg-[#222222] border border-neutral-700 rounded-2xl space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-[#F3B71B] font-bold">
              <Smartphone className="w-4 h-4" />
              <span>How to Install on iPhone / iPad (Safari):</span>
            </div>
            <ol className="space-y-2 text-neutral-300 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Tap the <strong className="text-white">Share</strong> button <Share className="inline w-3.5 h-3.5 text-cyan-400 mx-0.5" /> in Safari's bottom toolbar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="inline w-3.5 h-3.5 text-[#F3B71B] mx-0.5" />.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top right corner. Done!</span>
              </li>
            </ol>
          </div>
        ) : (
          /* Chrome / Android manual guide fallback */
          <div className="p-4 bg-[#222222] border border-neutral-700 rounded-2xl space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-[#F3B71B] font-bold">
              <Smartphone className="w-4 h-4" />
              <span>How to Install on Android / Chrome:</span>
            </div>
            <ol className="space-y-2 text-neutral-300 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Tap the <strong className="text-white">three dots menu (⋮)</strong> in Chrome at the top right.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Select <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Confirm install to add the STUDSPOT icon to your phone launcher.</span>
              </li>
            </ol>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Free & Safe PWA
          </span>
          <button
            onClick={onClose}
            className="hover:underline text-neutral-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC<{ className?: string; variant?: 'button' | 'badge' | 'banner' }> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed in standalone mode, return null or subtle badge
  if (isInstalled) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={() => {
            if (isInstallable) {
              install();
            } else {
              setShowModal(true);
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F3B71B]/15 hover:bg-[#F3B71B]/25 text-[#F3B71B] border border-[#F3B71B]/40 transition ${className}`}
          title="Add STUDSPOT to Home Screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add to Home Screen</span>
          <span className="sm:hidden">Install App</span>
        </button>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-950 p-0.5 border border-[#F3B71B]/50 shrink-0">
              <img
                src="/src/assets/images/studspot_gold_icon_1792275165524.jpg"
                alt="STUDSPOT"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                Install STUDSPOT on your phone
                <span className="text-[9px] bg-[#F3B71B] text-black px-1.5 py-0.2 rounded font-black font-mono">PWA</span>
              </p>
              <p className="text-[11px] text-neutral-300">
                Faster loading, zero browser bars & instant comrade listings
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                setShowModal(true);
              }
            }}
            className="px-3.5 py-1.5 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs rounded-xl whitespace-nowrap transition shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>
        </div>
        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className={`flex items-center gap-2 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] px-3 py-1.5 text-xs font-black text-black shadow-sm transition ${className}`}
      >
        <Download className="w-4 h-4 stroke-[2.5]" />
        <span>Add to Home Screen</span>
      </button>
      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
