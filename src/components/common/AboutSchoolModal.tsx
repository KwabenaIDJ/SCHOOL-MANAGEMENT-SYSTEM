import React from 'react';
import { Modal } from './Modal';
import {
  Sparkles,
  Target,
  Compass,
  Building2,
  BookOpen,
  FlaskConical,
  Laptop,
  Trophy,
  Users,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface AboutSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutSchoolModal: React.FC<AboutSchoolModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About Kidshine Montessori School"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-800">
        {/* Banner Section */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Premier Montessori & Basic Education Institution
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Kidshine Montessori School — Accra, Ghana
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Founded with a commitment to academic excellence, moral integrity, and holistic child development, Kidshine Montessori School provides basic education from <strong>Creche to Junior High School (JHS 3)</strong>.
          </p>
        </div>

        {/* Vision & Mission Statements */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase">
              <Target className="h-4 w-4 text-blue-700" /> Our Vision
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              "To be a premier basic education institution in Ghana, empowering disciplined, innovative, and ethically grounded young leaders capable of thriving in a global society."
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase">
              <Compass className="h-4 w-4 text-blue-700" /> Our Mission
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              "To deliver holistic, child-centered Montessori and standard basic education that fosters critical thinking, digital literacy, moral uprightness, and 100% BECE examination success."
            </p>
          </div>
        </div>

        {/* Campus Facilities & Learning Infrastructure */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="h-4 w-4 text-blue-700" /> Campus Infrastructure & Learning Facilities
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Science Lab Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <img
                src="/images/science_lab.jpg"
                alt="Kidshine Montessori Science Laboratory"
                className="h-36 w-full object-cover"
              />
              <div className="p-3.5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <FlaskConical className="h-4 w-4 text-blue-700" /> Integrated Science Laboratories
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Fully equipped biology, chemistry, and physics experimental stations designed for hands-on practical learning.
                </p>
              </div>
            </div>

            {/* ICT Computer Lab Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <img
                src="/images/computer_lab.jpg"
                alt="Kidshine Montessori ICT Computer Laboratory"
                className="h-36 w-full object-cover"
              />
              <div className="p-3.5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Laptop className="h-4 w-4 text-blue-700" /> Modern ICT & Computer Lab
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  High-speed fiber connectivity, modern desktop computer workstations, and foundational coding & computing curriculum.
                </p>
              </div>
            </div>

            {/* Montessori Resource Center Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <img
                src="/images/montessori_room.jpg"
                alt="Kidshine Montessori Sensory Resource Room"
                className="h-36 w-full object-cover"
              />
              <div className="p-3.5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <BookOpen className="h-4 w-4 text-blue-700" /> Montessori Sensory & Resource Center
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Dedicated early childhood tactile learning apparatus, sensory development kits, and a rich student library.
                </p>
              </div>
            </div>

            {/* Sports Field & Complex Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <img
                src="/images/sports_complex.jpg"
                alt="Kidshine Montessori Sports Complex Field"
                className="h-36 w-full object-cover"
              />
              <div className="p-3.5 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Trophy className="h-4 w-4 text-blue-700" /> Sports Complex & Extra-Curriculars
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Mini football pitch, basketball court, inter-house sports tournaments, chess club, debate team, and cultural ensemble.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Departments Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Award className="h-4 w-4 text-blue-700" /> Academic Divisions & Class Levels
          </h4>

          <div className="grid gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center">
              <span className="block text-xs font-black text-blue-900">Preschool</span>
              <span className="text-[10px] text-slate-600 font-bold">Creche to KG 2</span>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center">
              <span className="block text-xs font-black text-blue-900">Lower Primary</span>
              <span className="text-[10px] text-slate-600 font-bold">Grade 1 to 3</span>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center">
              <span className="block text-xs font-black text-blue-900">Upper Primary</span>
              <span className="text-[10px] text-slate-600 font-bold">Grade 4 to 6</span>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center">
              <span className="block text-xs font-black text-blue-900">JHS Department</span>
              <span className="text-[10px] text-slate-600 font-bold">JHS 1 to 3</span>
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-700" /> School Campus Location & Contact Info
          </div>
          <div className="grid gap-2 sm:grid-cols-3 text-slate-600">
            <div>📍 Accra, Ghana</div>
            <div>📞 +233 24 100 2000</div>
            <div>✉️ info@kidshinemontessori.edu.gh</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </Modal>
  );
};
