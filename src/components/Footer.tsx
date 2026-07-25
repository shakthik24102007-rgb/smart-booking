import React from 'react';
import { UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-950 text-amber-100 border-t border-amber-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-lg font-serif font-bold text-white">Food Zone</span>
          </div>
          <p className="text-amber-200/80 leading-relaxed">
            Official Campus Canteen Pre-order & Pickup Platform. Skip waiting in long lines and track your hot meals live!
          </p>
        </div>

        {/* Canteen Hours */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider font-serif">Operating Hours</h4>
          <ul className="space-y-1.5 text-amber-200/80">
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Mon - Fri: 8:00 AM - 9:30 PM</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Sat - Sun: 9:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Pickup Locations */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider font-serif">Counter Pickup Bays</h4>
          <ul className="space-y-1.5 text-amber-200/80">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Bay 1: Biryanis, Rolls & Main Meals</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Bay 2: Beverages, Coffee & Snacks</span>
            </li>
          </ul>
        </div>

        {/* Safety & Help */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider font-serif">Canteen Helpdesk</h4>
          <p className="text-amber-200/80">Have questions about an order or dietary requirements?</p>
          <p className="font-bold text-amber-300 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Ext. 4082 (Campus Canteen Desk)
          </p>
        </div>
      </div>

      <div className="border-t border-amber-900/60 py-4 text-center text-[11px] text-amber-300/60 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-2">
        <span>© 2026 Food Zone Campus Canteen System. All rights reserved.</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> FSSAI Quality Certified Canteen
        </span>
      </div>
    </footer>
  );
};
