import React from 'react';
import {
  FileText,
  Award,
  Home,
  FileCheck2,
  HeartHandshake,
  Sprout,
  Copy,
  Printer,
  HardHat,
  ShieldAlert,
  BadgeCheck,
  CreditCard,
  FileEdit,
  Vote,
  UserCheck,
  Globe,
  Zap,
  GraduationCap,
  Car,
  Train,
  Send,
  ShoppingBag,
  Coins,
  Baby,
  FileSpreadsheet,
  ShieldCheck,
  Heart,
  Building2,
  Banknote,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'FileText': return <FileText className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Home': return <Home className={className} />;
    case 'FileCheck2': return <FileCheck2 className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Copy': return <Copy className={className} />;
    case 'Printer': return <Printer className={className} />;
    case 'HardHat': return <HardHat className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'BadgeCheck': return <BadgeCheck className={className} />;
    case 'CreditCard': return <CreditCard className={className} />;
    case 'FileEdit': return <FileEdit className={className} />;
    case 'Vote': return <Vote className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Train': return <Train className={className} />;
    case 'Send': return <Send className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Banknote': return <Banknote className={className} />;
    case 'Layers': return <Layers className={className} />;
    default: return <Sparkles className={className} />;
  }
};
