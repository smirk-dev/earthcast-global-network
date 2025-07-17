
import { X, Users, Play, MapPin, Clock } from 'lucide-react';

interface BroadcastPanelProps {
  broadcast: {
    id: string;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    description: string;
    viewers: number;
    category: string;
    isLive: boolean;
  };
  onClose: () => void;
}

const BroadcastPanel = ({ broadcast, onClose }: BroadcastPanelProps) => {
  const formatViewers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="absolute top-20 right-6 w-96 bg-black bg-opacity-40 backdrop-blur-lg rounded-xl border border-cyan-400 border-opacity-30 text-white shadow-2xl z-30 animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-cyan-400 border-opacity-20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-cyan-400">{broadcast.name}</h3>
            <div className="flex items-center text-blue-200 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{broadcast.country}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status */}
        <div className="flex items-center mt-3">
          {broadcast.isLive ? (
            <div className="flex items-center text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold">LIVE NOW</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center text-cyan-400 mb-1">
              <Users className="w-4 h-4 mr-1" />
            </div>
            <div className="text-2xl font-bold">{formatViewers(broadcast.viewers)}</div>
            <div className="text-sm text-blue-200">Viewers</div>
          </div>
          <div className="bg-purple-900 bg-opacity-30 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-purple-300">{broadcast.category}</div>
            <div className="text-sm text-blue-200">Category</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-blue-200 mb-2">Description</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{broadcast.description}</p>
        </div>

        {/* Location Info */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-blue-200 mb-2">Location</h4>
          <div className="text-gray-300 text-sm">
            <div>Latitude: {broadcast.latitude.toFixed(4)}°</div>
            <div>Longitude: {broadcast.longitude.toFixed(4)}°</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {broadcast.isLive && (
            <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              Watch Live Stream
            </button>
          )}
          <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200">
            View Channel Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastPanel;
