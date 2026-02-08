import React from 'react';
import { Film } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-32">
      <div className="inline-block p-6 bg-white/5 rounded-3xl mb-6">
        <Film className="w-20 h-20 text-gray-600 mx-auto" />
      </div>
      <h3 className="text-3xl font-bold text-gray-400 mb-2">No videos found</h3>
      <p className="text-gray-500">Try adjusting your search or filters</p>
    </div>
  );
};

export default EmptyState;

