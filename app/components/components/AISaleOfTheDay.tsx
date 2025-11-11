import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, Loader2, Clock, Zap } from 'lucide-react';

interface AISaleOfTheDayProps {
  config: {
    heading?: string;
    sale_collection?: string;
    countdown_duration?: number;
    fallback_product?: string;
  };
  colorSchemes?: any[];
}

interface SaleRecommendation {
  productId: string;
  confidence: number;
  reasoning: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  source: 'vertex-ai' | 'fallback';
}

export function AISaleOfTheDay({ config, colorSchemes }: AISaleOfTheDayProps) {
  const {
    heading = "Today's Deal, Just for You",
    sale_collection = '',
    countdown_duration = 24,
    fallback_product = '',
  } = config;

  const [sale, setSale] = useState<SaleRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: countdown_duration,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    fetchSaleRecommendation();
  }, []);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchSaleRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from session
      const userId = sessionStorage.getItem('userId') || 'anonymous';

      // Build API URL
      const params = new URLSearchParams({
        userId,
      });

      if (sale_collection) {
        params.append('saleCollection', sale_collection);
      }

      if (fallback_product) {
        params.append('fallbackProduct', fallback_product);
      }

      const response = await fetch(`/api/ai/sale-of-the-day?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch sale recommendation');
      }

      const data = await response.json();

      if (data.success) {
        setSale(data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching sale:', err);
      setError('Unable to load personalized deal');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    // In production, this would add the product to cart
    alert('Adding to cart...\n' + JSON.stringify(sale, null, 2));
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !sale) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-white">{error || 'No sale available'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {heading}
            </h2>
            <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          </div>
          {sale.source === 'vertex-ai' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">
                AI-Selected Based on Your Preferences
              </span>
            </div>
          )}
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <Clock className="w-6 h-6 text-white" />
          <div className="flex gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
              <div className="text-3xl font-bold text-white">
                {String(timeRemaining.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 uppercase">Hours</div>
            </div>
            <div className="text-3xl font-bold text-white self-center">:</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
              <div className="text-3xl font-bold text-white">
                {String(timeRemaining.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 uppercase">Minutes</div>
            </div>
            <div className="text-3xl font-bold text-white self-center">:</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[70px]">
              <div className="text-3xl font-bold text-white">
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-white/80 uppercase">Seconds</div>
            </div>
          </div>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Product: {sale.productId}</p>
              </div>
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
                -{sale.discount}%
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Product Name
              </h3>

              {/* AI Reasoning */}
              {sale.reasoning && (
                <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{sale.reasoning}</p>
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-red-600">
                    ${sale.salePrice.toFixed(2)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ${sale.originalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-green-600 font-semibold">
                  You save ${(sale.originalPrice - sale.salePrice).toFixed(2)}!
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <ShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Free shipping • 30-day returns • Sustainable packaging
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
