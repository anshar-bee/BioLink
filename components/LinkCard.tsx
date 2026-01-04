import React from 'react';
import { LinkItem } from '../types';
import { ExternalLink, Trash2, Edit2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LinkCardProps {
  link: LinkItem;
  isEditable: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, isEditable, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group relative w-full mb-4 md:mb-6 ${link.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${isDragging ? 'scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : 'hover:-translate-y-1 hover:-translate-x-1'}`}
    >
      <div className="flex items-stretch">
        {/* Drag Handle - Only visible when editing */}
        {isEditable && (
          <div 
            {...attributes} 
            {...listeners}
            className="w-10 md:w-12 border-r-4 border-black bg-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 touch-none"
          >
            <GripVertical size={20} strokeWidth={3} className="md:w-6 md:h-6" />
          </div>
        )}

        {/* Main Link Area */}
        <a 
          href={isEditable ? undefined : link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex-1 p-3 sm:p-5 flex items-center justify-between ${isEditable ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={(e) => isEditable && e.preventDefault()}
        >
          <span className="font-bold text-base sm:text-xl tracking-tight truncate flex-1 font-mono pr-2">
            {link.title.toUpperCase()}
          </span>
          <div className="bg-black text-white p-1.5 md:p-2 rounded-none shrink-0">
            <ExternalLink size={16} strokeWidth={3} className="md:w-5 md:h-5" />
          </div>
        </a>
      </div>

      {/* Edit Controls Overlay */}
      {isEditable && (
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 flex gap-1 md:gap-2">
          <button 
            onClick={() => onEdit(link.id)}
            className="bg-white border-2 border-black p-1.5 md:p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform"
            aria-label="Edit link"
          >
            <Edit2 size={14} strokeWidth={3} className="md:w-4 md:h-4" />
          </button>
          <button 
            onClick={() => onDelete(link.id)}
            className="bg-[#ff6b6b] border-2 border-black p-1.5 md:p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform"
            aria-label="Delete link"
          >
            <Trash2 size={14} strokeWidth={3} className="md:w-4 md:h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkCard;