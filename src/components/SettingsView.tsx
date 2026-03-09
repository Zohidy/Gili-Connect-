import React from 'react';
import { 
  User, Shield, Bell, Lock, HelpCircle, Info, ChevronRight, LogOut, 
  Trash2, Globe, Eye, MessageSquare, UserX
} from 'lucide-react';
import { User as UserType } from '../types';

import { Language, translations } from '../translations';

interface SettingsViewProps {
  user: UserType | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  onEditProfile: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  onLogout, 
  onNavigate,
  onEditProfile,
  language,
  onLanguageChange
}) => {
  const t = translations[language] || translations['id'];

  const settingsSections = [
    {
      title: t.account,
      items: [
        { icon: User, label: t.personalInfo, action: onEditProfile },
        { icon: Lock, label: t.passwordSecurity, action: () => alert(language === 'id' ? 'Fitur ini akan segera hadir!' : 'This feature is coming soon!') },
        { 
          icon: Globe, 
          label: t.language, 
          action: () => {
            const newLang = language === 'id' ? 'en' : 'id';
            onLanguageChange(newLang);
          },
          badge: language.toUpperCase()
        },
      ]
    },
    {
      title: t.privacy,
      items: [
        { icon: Eye, label: t.accountPrivacy, action: () => alert(language === 'id' ? 'Akun Anda saat ini Publik' : 'Your account is currently Public') },
        { icon: UserX, label: t.blockedAccounts, action: () => alert(language === 'id' ? 'Anda belum memblokir siapa pun' : 'You haven\'t blocked anyone yet') },
        { icon: MessageSquare, label: t.directMessages, action: () => alert(language === 'id' ? 'Pengaturan pesan dikelola secara otomatis' : 'Message settings are managed automatically') },
      ]
    },
    {
      title: t.notifications,
      items: [
        { icon: Bell, label: t.pushNotifications, action: () => alert(language === 'id' ? 'Notifikasi diaktifkan' : 'Notifications enabled') },
      ]
    },
    {
      title: t.support,
      items: [
        { icon: HelpCircle, label: t.helpSupport, action: () => alert('Hubungi kami di support@giliconnect.com') },
        { icon: Info, label: t.about, action: () => alert('Gili Connect v1.0.0 - ' + (language === 'id' ? 'Menghubungkan Gili Trawangan' : 'Connecting Gili Trawangan')) },
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => onNavigate('feed')}
          className="p-2 hover:bg-border/30 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h2 className="text-2xl font-black text-primary">{t.settings}</h2>
      </div>

      <div className="space-y-8">
        {settingsSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest px-4">
              {section.title}
            </h3>
            <div className="neo-card overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-border/20 transition-colors ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-bold text-primary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {('badge' in item) && (
                      <span className="text-[10px] font-black bg-accent text-white px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-secondary opacity-40" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3 pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/10 transition-colors rounded-xl font-bold"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.logout}</span>
          </button>
          
          <button
            onClick={() => alert(language === 'id' ? 'Fitur hapus akun memerlukan verifikasi tambahan.' : 'Account deletion requires additional verification.')}
            className="w-full flex items-center gap-3 p-4 text-red-500/60 hover:bg-red-500/10 transition-colors rounded-xl font-bold text-sm"
          >
            <Trash2 className="w-5 h-5" />
            <span>{t.deleteAccount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
