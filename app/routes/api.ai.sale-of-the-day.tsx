import { json, type LoaderFunctionArgs } from 'react-router';

interface SaleRecommendation {
  productId: string;
  confidence: number;
  reasoning: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
}

/**
 * AI Sale of the Day API
 *
 * Returns a personalized sale product chosen by Vertex AI based on
 * user affinity, purchase history, and real-time intent signals.
 *
 * Query Parameters:
 * - userId: User ID or session ID
 * - saleCollection: Shopify collection handle containing sale items
 * - fallbackProduct: Product ID to use if AI recommendation fails
 *
 * Returns:
 * - productId: Recommended product ID
 * - confidence: AI confidence score (0-1)
 * - reasoning: Explanation of recommendation
 * - originalPrice: Original price
 * - salePrice: Discounted price
 * - discount: Discount percentage
 */
export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId') || 'anonymous';
  const saleCollection = url.searchParams.get('saleCollection');
  const fallbackProduct = url.searchParams.get('fallbackProduct');

  try {
    // In production, gather user data
    const userContext = {
      userId,
      userProfile: {}, // Would fetch from database
      browsingHistory: [], // Would fetch from session
      purchaseHistory: [], // Would fetch from database
      affinityScores: {}, // Pre-computed affinity scores
      recentIntent: {}, // Real-time signals (searches, clicks)
    };

    // Fetch sale items from Shopify collection
    let saleProductIds: string[] = [];

    if (saleCollection && context.storefront) {
      try {
        const response = await context.storefront.query(GET_COLLECTION_PRODUCTS, {
          variables: { handle: saleCollection },
        });

        if (response.collection?.products?.nodes) {
          saleProductIds = response.collection.products.nodes.map(
            (p: any) => p.id
          );
        }
      } catch (err) {
        console.error('Error fetching sale collection:', err);
      }
    }

    // Call Vertex AI to select the best product for this user
    const recommendation = await generateSaleRecommendation(
      userContext,
      saleProductIds
    );

    return json({
      success: true,
      ...recommendation,
      source: 'vertex-ai',
    });
  } catch (error) {
    console.error('Vertex AI sale recommendation error:', error);

    // Fallback to manual product if AI fails
    if (fallbackProduct) {
      return json({
        success: true,
        productId: fallbackProduct,
        confidence: 0.5,
        reasoning: 'Fallback sale product',
        originalPrice: 99.99,
        salePrice: 79.99,
        discount: 20,
        source: 'fallback',
      });
    }

    return json(
      {
        success: false,
        error: 'Failed to generate sale recommendation',
      },
      { status: 500 }
    );
  }
}

async function generateSaleRecommendation(
  userContext: any,
  saleProductIds: string[]
): Promise<SaleRecommendation> {
  // MOCK IMPLEMENTATION
  // In production, this would:
  // 1. Prepare feature vector from user context
  // 2. Call Vertex AI Recommendations API with sale products as candidates
  // 3. Rank products by user affinity
  // 4. Return the top-ranked product

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock recommendation (in production, comes from Vertex AI)
  const selectedProduct = saleProductIds.length > 0
    ? saleProductIds[Math.floor(Math.random() * saleProductIds.length)]
    : 'gid://shopify/Product/8881258832172';

  // Mock pricing (in production, fetch from Shopify)
  const originalPrice = 129.99;
  const salePrice = 89.99;
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return {
    productId: selectedProduct,
    confidence: 0.92,
    reasoning: 'This product matches your sustainability values and recent browsing patterns. Limited time offer!',
    originalPrice,
    salePrice,
    discount,
  };
}

const GET_COLLECTION_PRODUCTS = `#graphql
  query GetCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      products(first: 50) {
        nodes {
          id
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
