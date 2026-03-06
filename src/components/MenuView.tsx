import React from 'react';
import { 
  MessageCircle, Users, UserPlus, Calendar, Home, Settings, HelpCircle, UserPlus2, LogOut, ChevronDown, RefreshCw
} from 'lucide-react';
import { User } from '../types';

interface MenuViewProps {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}

const menuItems = [
  { icon: Home, label: 'Beranda', color: 'text-blue-500' },
  { icon: MessageCircle, label: 'Pesan', color: 'text-blue-500' },
  { icon: Users, label: 'Grup', color: 'text-blue-500' },
  { icon: UserPlus, label: 'Teman', color: 'text-blue-500' },
  { icon: Calendar, label: 'Acara', color: 'text-red-500' },
];

const MenuView: React.FC<MenuViewProps> = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#fdfcf8] overflow-y-auto pb-20">
      <div className="p-4 border-b border-[#1a2e35]/10 flex items-center justify-between sticky top-0 bg-[#fdfcf8]">
        <h2 className="text-2xl font-black text-[#1a2e35]">Menu</h2>
        <button onClick={onClose} className="p-2 text-[#1a2e35]">Tutup</button>
      </div>

      <div className="p-4 space-y-4">
        {/* User Profile */}
        <div className="card p-4 flex items-center justify-between hover:bg-[#1a2e35]/5 transition-colors">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-bold text-[#1a2e35]">{user?.name}</div>
              <div className="text-xs text-[#1a2e35]/60">Lihat profil Anda</div>
            </div>
          </div>
          <RefreshCw className="w-5 h-5 text-[#1a2e35]/40" />
        </div>

        {/* Switch Account */}
        <div className="card p-4 flex items-center justify-between hover:bg-[#1a2e35]/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a2e35]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1a2e35]" />
            </div>
            <div className="font-bold text-[#1a2e35]">Beralih akun</div>
          </div>
          <ChevronDown className="w-5 h-5 text-[#1a2e35]/40" />
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <div key={index} className="card p-4 flex flex-col gap-3 hover:bg-[#1a2e35]/5 transition-colors cursor-pointer">
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="font-bold text-sm text-[#1a2e35]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer Items */}
        <div className="space-y-2 pt-4 border-t border-[#1a2e35]/10">
          <div className="p-4 flex items-center gap-3 hover:bg-[#1a2e35]/5 transition-colors cursor-pointer">
            <Settings className="w-5 h-5 text-[#1a2e35]" />
            <span className="font-bold text-[#1a2e35]">Pengaturan & privasi</span>
          </div>
          <div className="p-4 flex items-center gap-3 hover:bg-[#1a2e35]/5 transition-colors cursor-pointer">
            <HelpCircle className="w-5 h-5 text-[#1a2e35]" />
            <span className="font-bold text-[#1a2e35]">Bantuan & dukungan</span>
          </div>
          <div className="p-4 flex items-center gap-3 hover:bg-[#1a2e35]/5 transition-colors cursor-pointer">
            <UserPlus2 className="w-5 h-5 text-[#1a2e35]" />
            <span className="font-bold text-[#1a2e35]">Tambahkan akun</span>
          </div>
          <div onClick={onLogout} className="p-4 flex items-center gap-3 hover:bg-red-50 transition-colors cursor-pointer text-red-600">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Keluar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuView;
