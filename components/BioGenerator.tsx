import React from 'react';

interface BioGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onBioGenerated: (bio: string) => void;
}

// AI Bio Generator feature has been disabled.
const BioGenerator: React.FC<BioGeneratorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return null;
};

export default BioGenerator;