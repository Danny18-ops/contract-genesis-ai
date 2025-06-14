
import { FileText, Shield, User, Home, Users, Briefcase, Award, Car, Package, Handshake } from 'lucide-react';

interface ContractTypeIconProps {
  contractType: string;
  className?: string;
}

export const ContractTypeIcon = ({ contractType, className = "w-6 h-6" }: ContractTypeIconProps) => {
  const iconMap = {
    nda: Shield,
    freelance: User,
    rental: Home,
    employment: Briefcase,
    partnership: Users,
    consulting: Award,
    license: FileText,
    jobOffer: Briefcase,
    business: Handshake,
    carRental: Car,
    storage: Package
  };

  const Icon = iconMap[contractType as keyof typeof iconMap] || FileText;
  
  return <Icon className={className} />;
};

export const getContractTypeGradient = (contractType: string) => {
  const gradientMap = {
    nda: 'from-red-500 to-pink-500',
    freelance: 'from-blue-500 to-indigo-500',
    rental: 'from-green-500 to-emerald-500',
    employment: 'from-purple-500 to-violet-500',
    partnership: 'from-orange-500 to-amber-500',
    consulting: 'from-cyan-500 to-teal-500',
    license: 'from-gray-500 to-slate-500',
    jobOffer: 'from-indigo-500 to-purple-500',
    business: 'from-emerald-500 to-green-500',
    carRental: 'from-blue-500 to-cyan-500',
    storage: 'from-amber-500 to-orange-500'
  };

  return gradientMap[contractType as keyof typeof gradientMap] || 'from-blue-500 to-indigo-500';
};

export const getContractTypeImage = (contractType: string) => {
  const imageMap = {
    nda: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    freelance: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    rental: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    employment: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    partnership: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    consulting: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    license: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    jobOffer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    business: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    carRental: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    storage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop'
  };

  return imageMap[contractType as keyof typeof imageMap] || imageMap.freelance;
};
