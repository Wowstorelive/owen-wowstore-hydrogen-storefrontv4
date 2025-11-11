/**
 * Component Renderer
 *
 * Dynamically renders Component Library components based on their type.
 * This acts as a bridge between the CMS data and the actual React components.
 */

import type { Component, BrandColorScheme } from '~/lib/cms-client.server';

// Import component implementations
import { HeroVideoBackground } from './components/HeroVideoBackground';
import { HeroImageHotspots } from './components/HeroImageHotspots';
import { HeroBannerSlider } from './components/HeroBannerSlider';
import { ProductGridQuickAdd } from './components/ProductGridQuickAdd';
import { CollectionTabs } from './components/CollectionTabs';
import { CollectionBannerGrid } from './components/CollectionBannerGrid';
import { UrgencyTimer } from './components/UrgencyTimer';
import { StockIndicator } from './components/StockIndicator';
import { LiveSalesPopup } from './components/LiveSalesPopup';
import { ShippingProgressBar } from './components/ShippingProgressBar';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { InstagramShopFeed } from './components/InstagramShopFeed';
import { TikTokShopFeed } from './components/TikTokShopFeed';

interface ComponentRendererProps {
  component: Component;
  config: any;
  colorSchemes: BrandColorScheme[];
}

// Component mapping - maps slugs to React components
const componentMap: Record<string, React.ComponentType<any>> = {
  'hero-video-background': HeroVideoBackground,
  'hero-image-hotspots': HeroImageHotspots,
  'hero-banner-slider': HeroBannerSlider,
  'product-grid-quick-add': ProductGridQuickAdd,
  'collection-tabs': CollectionTabs,
  'collection-banner-grid': CollectionBannerGrid,
  'urgency-timer': UrgencyTimer,
  'stock-indicator': StockIndicator,
  'live-sales-popup': LiveSalesPopup,
  'shipping-progress-bar': ShippingProgressBar,
  'exit-intent-popup': ExitIntentPopup,
  'instagram-shop-feed': InstagramShopFeed,
  'tiktok-shop-feed': TikTokShopFeed,
};

export function ComponentRenderer({ component, config, colorSchemes }: ComponentRendererProps) {
  const ComponentToRender = componentMap[component.slug];

  if (!ComponentToRender) {
    console.warn(`Component not found: ${component.slug}`);
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
        <p className="text-yellow-800">
          Component "{component.name}" is not yet implemented.
        </p>
        <p className="text-sm text-yellow-600 mt-2">
          Slug: {component.slug} | Type: {component.component_type}
        </p>
      </div>
    );
  }

  return (
    <div className="component-wrapper" data-component={component.slug}>
      <ComponentToRender config={config} colorSchemes={colorSchemes} />
    </div>
  );
}

/**
 * Component Implementation Templates
 *
 * Below are example implementations for each component.
 * These should be moved to separate files in app/components/components/
 */

// Example Component Implementation
export function ExampleComponent({ config, colorSchemes }: { config: any; colorSchemes: BrandColorScheme[] }) {
  const colorScheme = colorSchemes.find(cs => cs.slug === config.colorScheme) || colorSchemes[0];

  return (
    <div
      className="example-component py-12"
      style={{
        backgroundColor: colorScheme?.background_color || '#ffffff',
        color: colorScheme?.text_color || '#000000',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{config.title || 'Component Title'}</h2>
        <p>{config.description || 'Component description'}</p>
      </div>
    </div>
  );
}
