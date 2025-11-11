import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Play } from 'lucide-react';

interface Hotspot {
  product: string;
  position_x: number;
  position_y: number;
}

interface TikTokVideo {
  video_url: string;
  cover_image: string;
  hotspots: Hotspot[];
}

interface TikTokShopFeedProps {
  config: {
    heading?: string;
    description?: string;
    layout?: 'grid' | 'carousel';
    videos?: TikTokVideo[];
  };
  colorSchemes?: any[];
}

export function TikTokShopFeed({ config, colorSchemes }: TikTokShopFeedProps) {
  const {
    heading = 'Shop Our TikTok',
    description = '<p>See our products in action on TikTok</p>',
    layout = 'grid',
    videos = [],
  } = config;

  const [selectedHotspot, setSelectedHotspot] = useState<{ videoIndex: number; hotspot: Hotspot } | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const handleVideoClick = (videoIndex: number, videoUrl: string) => {
    // In production, this would open the TikTok video in a modal or native TikTok app
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
    setPlayingVideo(videoIndex);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {/* Videos Grid */}
        <div className={`grid ${layout === 'carousel' ? 'grid-flow-col auto-cols-[280px] overflow-x-auto gap-4 pb-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'}`}>
          {videos.map((video, videoIndex) => (
            <motion.div
              key={videoIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: videoIndex * 0.1 }}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              onMouseEnter={() => setHoveredVideo(videoIndex)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => handleVideoClick(videoIndex, video.video_url)}
            >
              {/* TikTok Video Cover */}
              <img
                src={video.cover_image || '/placeholder.jpg'}
                alt={`TikTok video ${videoIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* TikTok Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={32} className="text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Product Hotspots */}
              {hoveredVideo === videoIndex && video.hotspots.map((hotspot, hotspotIndex) => (
                <motion.button
                  key={hotspotIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    left: `${hotspot.position_x}%`,
                    top: `${hotspot.position_y}%`,
                  }}
                  className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot({ videoIndex, hotspot });
                  }}
                >
                  <Plus size={20} className="text-gray-900" />
                </motion.button>
              ))}

              {/* Hotspot Count Badge */}
              {video.hotspots.length > 0 && (
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 z-20">
                  <ShoppingBag size={14} className="text-pink-600" />
                  <span className="text-sm font-semibold text-gray-900">{video.hotspots.length}</span>
                </div>
              )}

              {/* TikTok Style Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <span className="text-white text-sm font-semibold">yourbrand</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Card Modal */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedHotspot(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>

                <div className="mt-2">
                  <h3 className="text-2xl font-bold mb-2 text-white">Featured Product</h3>
                  <p className="text-gray-400 mb-4">
                    Product ID: {selectedHotspot.hotspot.product || 'Not configured'}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    This is a placeholder. In production, this would show the actual product card with image, price, and Add to Cart button.
                  </p>
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
