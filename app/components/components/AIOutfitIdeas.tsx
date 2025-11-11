import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, Loader2, Plus } from 'lucide-react';

interface AIOutfitIdeasProps {
  config: {
    heading?: string;
    subheading?: string;
    max_items?: number;
    fallback_outfit?: string[];
  };
  colorSchemes?: any[];
}

interface OutfitRecommendation {
  heroProduct: string;
  complementaryItems: string[];
  confidence: number;
  reasoning: string;
  source: 'vertex-ai' | 'fallback';
}

export function AIOutfitIdeas({ config, colorSchemes }: AIOutfitIdeasProps) {
  const {
    heading = 'Complete Your Look',
    subheading = 'AI-powered recommendations just for you',
    max_items = 4,
    fallback_outfit = [],
  } = config;

  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutfitRecommendation();
  }, []);

  const fetchOutfitRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from session (or generate anonymous ID)
      const userId = sessionStorage.getItem('userId') || 'anonymous';

      // Build API URL
      const params = new URLSearchParams({
        userId,
        maxItems: max_items.toString(),
      });

      if (fallback_outfit.length > 0) {
        params.append('fallbackOutfit', fallback_outfit.join(','));
      }

      const response = await fetch(`/api/ai/outfit-recommendations?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch outfit recommendation');
      }

      const data = await response.json();

      if (data.success) {
        setOutfit(data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching outfit:', err);
      setError('Unable to load personalized recommendations');
    } finally {
      setLoading(false);
    }
  };

  const addCompleteOutfitToCart = async () => {
    // In production, this would add all products to cart
    alert('Adding complete outfit to cart...\n' + JSON.stringify(outfit, null, 2));
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !outfit) {
    return (
      <section className="py-12 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">{error || 'No recommendations available'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {heading}
            </h2>
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <p className="text-gray-600 text-lg">{subheading}</p>
          {outfit.source === 'vertex-ai' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-700">
                AI Confidence: {Math.round(outfit.confidence * 100)}%
              </span>
            </div>
          )}
        </motion.div>

        {/* AI Reasoning */}
        {outfit.reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-sm border border-purple-100"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{outfit.reasoning}</p>
            </div>
          </motion.div>
        )}

        {/* Outfit Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Hero Product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Hero Product: {outfit.heroProduct}</p>
              </div>
              <div className="absolute top-4 left-4 z-20">
                <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold shadow-lg">
                  Featured Item
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <h3 className="text-2xl font-bold mb-2">Product Name</h3>
                <p className="text-lg font-semibold">$99.99</p>
              </div>
            </div>
          </motion.div>

          {/* Complementary Items */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {outfit.complementaryItems.map((productId, index) => (
              <motion.div
                key={productId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-semibold">Item {index + 1}</p>
                  <p className="text-xs">$49.99</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <button
            onClick={addCompleteOutfitToCart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <ShoppingCart size={24} />
            <span>Add Complete Outfit to Cart</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {outfit.complementaryItems.length + 1} items
            </span>
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Bundle discount applied • Free shipping on complete outfits
          </p>
        </motion.div>
      </div>
    </section>
  );
}
