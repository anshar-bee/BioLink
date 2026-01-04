import React, { useState, useEffect } from 'react';
import { Settings, Plus, Save, Image as ImageIcon, Loader2, Instagram, Youtube } from 'lucide-react';
import NeoButton from './components/NeoButton';
import LinkCard from './components/LinkCard';
import AuthModal from './components/AuthModal';
import { LinkItem, UserProfile } from './types';
import { INITIAL_PROFILE, INITIAL_LINKS, AVAILABLE_COLORS } from './constants';
import * as db from './services/db';

// DnD Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

function App() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  
  // Modals
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Edit Link State
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [editingLinkData, setEditingLinkData] = useState<LinkItem | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load data from IndexedDB/API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedProfile, savedLinks] = await Promise.all([
          db.getProfile(),
          db.getLinks()
        ]);
        setProfile(savedProfile);
        setLinks(savedLinks);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save changes to DB whenever Profile changes (Debounced)
  // We use debounce here because typing in inputs triggers this on every keystroke.
  // Google Apps Script can get rate-limited if hit too frequently.
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      db.saveProfile(profile);
    }, 1000); // Wait 1s after user stops typing

    return () => clearTimeout(timeoutId);
  }, [profile, loading]);

  // Save changes to DB whenever Links change
  // Link changes (add, delete, reorder, finish edit) are discrete events, so immediate save is fine.
  useEffect(() => {
    if (!loading) {
      db.saveLinks(links);
    }
  }, [links, loading]);

  const handleEditClick = () => {
    if (isEditing) {
      // Force immediate save when exiting edit mode to ensure latest state is captured
      // even if debounce timer hasn't fired yet.
      db.saveProfile(profile);
      setIsEditing(false);
      setActiveLinkId(null);
    } else {
      // If trying to enter edit mode, ask for password
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsEditing(true);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleAddNewLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'NEW LINK',
      url: 'https://',
      color: 'bg-white',
    };
    setLinks([newLink, ...links]);
    // Automatically enter edit mode for new link
    setActiveLinkId(newLink.id);
    setEditingLinkData(newLink);
  };

  const startEditLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setActiveLinkId(id);
      setEditingLinkData({ ...link });
    }
  };

  const saveLinkEdit = () => {
    if (editingLinkData) {
      setLinks(links.map(l => l.id === editingLinkData.id ? editingLinkData : l));
      setActiveLinkId(null);
      setEditingLinkData(null);
    }
  };

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-8 max-w-2xl mx-auto">
      
      {/* Top Controls */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
         {isEditing ? (
           <NeoButton onClick={handleEditClick} colorClass="bg-[#ccff00]" variant="icon">
             <Save size={20} />
           </NeoButton>
         ) : (
           <NeoButton onClick={handleEditClick} variant="icon">
             <Settings size={20} />
           </NeoButton>
         )}
      </div>

      <main className="relative">
        
        {/* Profile Section */}
        <section className={`mb-8 md:mb-12 text-center p-6 md:p-8 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isEditing ? 'border-dashed' : ''}`}>
          
          <div className="relative inline-block mb-4 md:mb-6 group">
            <img 
              src={profile.avatarUrl} 
              alt="Profile" 
              className="w-24 h-24 md:w-40 md:h-40 object-cover border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-full"
            />
             {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors">
                 <ImageIcon className="text-white" />
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <input 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="text-2xl md:text-3xl font-black text-center border-b-4 border-black focus:outline-none focus:bg-yellow-200 p-2 font-mono w-full"
                placeholder="USER_NAME"
              />
              <div className="relative">
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full text-center border-2 border-black p-2 font-mono text-xs md:text-sm focus:outline-none focus:bg-yellow-200 min-h-[80px]"
                  placeholder="Your bio here..."
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter uppercase break-words">{profile.name}</h1>
              <p className="text-sm md:text-xl font-mono leading-relaxed bg-black text-white inline-block px-2 py-1 transform -rotate-1">
                {profile.bio}
              </p>
            </>
          )}
        </section>

        {/* Links Section */}
        <div className="space-y-4 md:space-y-6">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={links.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map((link) => (
                <div key={link.id}>
                  {isEditing && activeLinkId === link.id && editingLinkData ? (
                    // Edit Form for a specific link
                    <div className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 animate-in slide-in-from-left duration-200">
                      <h3 className="font-bold mb-4 text-lg md:text-xl bg-[#ccff00] inline-block px-2 border-2 border-black">EDIT LINK</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block font-bold text-xs mb-1">TITLE</label>
                          <input 
                            value={editingLinkData.title}
                            onChange={(e) => setEditingLinkData({...editingLinkData, title: e.target.value})}
                            className="w-full border-2 border-black p-2 font-mono focus:bg-gray-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-xs mb-1">URL</label>
                          <input 
                            value={editingLinkData.url}
                            onChange={(e) => setEditingLinkData({...editingLinkData, url: e.target.value})}
                            className="w-full border-2 border-black p-2 font-mono focus:bg-gray-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-xs mb-1">COLOR</label>
                          <div className="flex gap-2 flex-wrap">
                            {AVAILABLE_COLORS.map(c => (
                              <button
                                key={c}
                                onClick={() => setEditingLinkData({...editingLinkData, color: c})}
                                className={`w-8 h-8 md:w-10 md:h-10 border-2 border-black ${c} ${editingLinkData.color === c ? 'ring-2 ring-offset-2 ring-black transform scale-110' : ''}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <NeoButton onClick={() => setActiveLinkId(null)} variant="secondary" className="text-xs">CANCEL</NeoButton>
                          <NeoButton onClick={saveLinkEdit} className="text-xs">DONE</NeoButton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal Link View (Sortable Item)
                    <LinkCard 
                      link={link} 
                      isEditable={isEditing}
                      onEdit={startEditLink}
                      onDelete={handleDeleteLink}
                    />
                  )}
                </div>
              ))}
            </SortableContext>
          </DndContext>

          {isEditing && (
            <button 
              onClick={handleAddNewLink}
              className="w-full py-4 md:py-6 border-4 border-black border-dashed font-bold text-lg md:text-xl flex items-center justify-center gap-2 hover:bg-[#ccff00] transition-colors group"
            >
              <Plus className="group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} /> 
              ADD NEW SLOT
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center font-mono text-xs font-bold opacity-60 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/muhammad_anshar_g/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={24} strokeWidth={2.5} />
            </a>
            <a 
              href="https://youtube.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube size={24} strokeWidth={2.5} />
            </a>
          </div>
        </footer>

      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;