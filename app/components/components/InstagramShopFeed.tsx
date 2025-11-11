import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus } from 'lucide-react';

interface Hotspot {
  product: string;
  position_x: number;
  position_y: number;
}

interface InstagramPost {
  media_type: 'image' | 'video';
  image: string;
  video_url?: string;
  hotspots: Hotspot[];
}

interface InstagramShopFeedProps {
  config: {
    heading?: string;
    description?: string;
    layout?: 'grid' | 'carousel';
    posts?: InstagramPost[];
  };
  colorSchemes?: any[];
}

export function InstagramShopFeed({ config, colorSchemes }: InstagramShopFeedProps) {
  const {
    heading = 'Shop Our Instagram',
    description = '<p>Discover our latest products featured on Instagram</p>',
    layout = 'grid',
    posts = [],
  } = config;

  const [selectedHotspot, setSelectedHotspot] = useState<{ postIndex: number; hotspot: Hotspot } | null>(null);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            {heading}
          </motion.h2>
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {/* Posts Grid */}
        <div className={`grid ${layout === 'carousel' ? 'grid-flow-col auto-cols-[300px] overflow-x-auto gap-4 pb-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
          {posts.map((post, postIndex) => (
            <motion.div
              key={postIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: postIndex * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              onMouseEnter={() => setHoveredPost(postIndex)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Instagram Post Image/Video */}
              {post.media_type === 'video' && post.video_url ? (
                <video
                  src={post.video_url}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={post.image || '/placeholder.jpg'}
                  alt={`Instagram post ${postIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}

              {/* Instagram Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Product Hotspots */}
              {hoveredPost === postIndex && post.hotspots.map((hotspot, hotspotIndex) => (
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
                  onClick={() => setSelectedHotspot({ postIndex, hotspot })}
                >
                  <Plus size={20} className="text-gray-900" />
                </motion.button>
              ))}

              {/* Hotspot Count Badge */}
              {post.hotspots.length > 0 && (
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 z-20">
                  <ShoppingBag size={14} className="text-pink-600" />
                  <span className="text-sm font-semibold text-gray-900">{post.hotspots.length}</span>
                </div>
              )}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedHotspot(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>

                <div className="mt-2">
                  <h3 className="text-2xl font-bold mb-2">Featured Product</h3>
                  <p className="text-gray-600 mb-4">
                    Product ID: {selectedHotspot.hotspot.product || 'Not configured'}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    This is a placeholder. In production, this would show the actual product card with image, price, and Add to Cart button.
                  </p>
                  <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
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
