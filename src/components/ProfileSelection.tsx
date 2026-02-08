import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  avatar: string;
  isKid: boolean;
}

interface ProfileSelectionProps {
  onSelectProfile: (profile: Profile) => void;
}

const PROFILES: Profile[] = [
  { id: 1, name: 'User', avatar: '👤', isKid: false },
  { id: 2, name: 'Kids', avatar: '👶', isKid: true },
  { id: 3, name: 'Guest', avatar: '🎭', isKid: false },
];

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelectProfile }) => {
  const [isManaging, setIsManaging] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-6xl font-medium mb-12">
          Who's watching?
        </h1>

        <div className="flex items-center justify-center gap-8 mb-12">
          {PROFILES.map(profile => (
            <div
              key={profile.id}
              onClick={() => !isManaging && onSelectProfile(profile)}
              className="group cursor-pointer"
            >
              <div className="relative">
                <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white transition-all mb-3 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-7xl">
                  {profile.avatar}
                </div>
                {isManaging && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <Pencil className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-400 group-hover:text-white text-xl font-medium transition-colors">
                {profile.name}
              </p>
            </div>
          ))}

          {/* Add Profile */}
          <div className="group cursor-pointer">
            <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-white transition-all mb-3 bg-gray-800 flex items-center justify-center">
              <Plus className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <p className="text-gray-400 group-hover:text-white text-xl font-medium transition-colors">
              Add Profile
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsManaging(!isManaging)}
          className="text-gray-400 hover:text-white text-xl font-medium border border-gray-500 hover:border-white px-8 py-2 transition-all"
        >
          {isManaging ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSelection;

