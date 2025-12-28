
import React from 'react';
import { Landmark } from '../types';

interface DriverCardProps {
  landmark: Landmark;
  onClose: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ landmark, onClose }) => {
  // Mapping English names to Georgian for the driver
  const georgianNames: Record<string, string> = {
      'Bagrati Cathedral': 'ბაგრატის ტაძარი',
      'White Bridge': 'თეთრი ხიდი',
      'Colchis Fountain': 'კოლხური შადრევანი',
      'History Museum': 'ქუთაისის ისტორიული მუზეუმი',
      'Kutaisi Botanical Garden': 'ბოტანიკური ბაღი',
      'Gelati Monastery': 'გელათის მონასტერი',
      'Motsameta Monastery': 'მოწამეთა',
      'Prometheus Cave': 'პრომეთეს მღვიმე',
      'Sataplia Nature Reserve': 'სათაფლია',
      'Kutaisi International Airport': 'ქუთაისის აეროპორტი',
      'City Centre Apartment - Mari': 'ქალაქის ცენტრი (მარიამი)',
      'Palaty': 'რესტორანი პალატი',
      'Sisters (Debi)': 'დები (სისტერს)',
      'Papavero': 'პაპავერო',
      'Hacker-Pschorr Kutaisi': 'ჰაკერ-ფშორი',
      'Gallery Terrace': 'გალერეა ტერასა'
  };

  const geoName = georgianNames[landmark.name] || landmark.name;

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-900 flex flex-col items-center justify-center p-6 animate-fadeIn">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-2xl active:bg-white/20"
        >
            ✕
        </button>

        <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative">
            {/* Header Hint */}
            <div className="bg-yellow-400 p-4 text-center">
                <p className="text-yellow-900 font-bold text-xs uppercase tracking-widest">Show this to your driver</p>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col items-center text-center">
                
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden mb-6 shadow-lg">
                    <img src={landmark.image} alt={landmark.name} className="w-full h-full object-cover" />
                </div>

                <p className="text-slate-400 text-sm font-bold uppercase mb-2">Please take me to:</p>
                
                {/* BIG GEORGIAN TEXT */}
                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 font-serif">
                    {geoName}
                </h2>

                <div className="w-full h-px bg-slate-100 my-4"></div>

                <p className="text-slate-500 font-medium text-lg">
                    {landmark.name}
                </p>

            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase">
                    <span>👋</span> Say "Madloba" (Thank you)
                </div>
            </div>
        </div>
    </div>
  );
};

export default DriverCard;
