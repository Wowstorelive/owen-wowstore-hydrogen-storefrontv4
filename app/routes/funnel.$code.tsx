import { json, type LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { Suspense, useState } from 'react';
import { FunnelStage } from '~/components/funnel/FunnelStage';
import { FunnelProgress } from '~/components/funnel/FunnelProgress';
import { WinterBackground } from '~/components/winter/WinterBackground';

interface FunnelData {
  id: string;
  code: string;
  name: string;
  stages: FunnelStageData[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
}

interface FunnelStageData {
  id: string;
  name: string;
  type: 'quiz' | 'product' | 'upsell' | 'checkout';
  content: any;
}

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  const { code } = params;

  if (!code) {
    throw new Response('Funnel code required', { status: 400 });
  }

  // Fetch funnel configuration from CMS API
  try {
    const apiUrl = `https://api.wowstore.live/funnels?funnel_code=eq.${code}&select=*,stages:funnel_stages(id,stage_name,stage_type,headline,subheadline,sort_order,config,components:funnel_stage_components(id,sort_order,component:component_library(id,name,slug,component_type,default_props)))`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Response('Error fetching funnel from CMS', { status: response.status });
    }

    const funnels = await response.json();

    if (!funnels || funnels.length === 0) {
      throw new Response('Funnel not found', { status: 404 });
    }

    const cmsData = funnels[0];

    // Transform CMS data to match expected FunnelData structure
    const funnelData: FunnelData = {
      id: cmsData.id.toString(),
      code: cmsData.funnel_code,
      name: cmsData.funnel_name,
      stages: cmsData.stages
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((stage: any) => ({
          id: stage.id.toString(),
          name: stage.stage_name,
          type: stage.stage_type,
          headline: stage.headline,
          subheadline: stage.subheadline,
          components: stage.components
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((comp: any) => ({
              slug: comp.component.slug,
              name: comp.component.name,
              type: comp.component.component_type,
              props: comp.component.default_props,
            })),
          content: {
            headline: stage.headline,
            subheadline: stage.subheadline,
          },
        })),
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
      },
    };

    return json({ funnel: funnelData });
  } catch (error) {
    console.error('Error loading funnel:', error);
    throw new Response('Error loading funnel', { status: 500 });
  }
}

export default function FunnelRoute() {
  const { funnel } = useLoaderData<typeof loader>();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Winter Background */}
      <WinterBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Suspense fallback={<FunnelLoadingSkeleton />}>
          <FunnelProgress 
            stages={funnel.stages}
            currentStage={currentStageIndex}
          />
          
          <FunnelStage
            stage={funnel.stages[currentStageIndex]}
            funnel={funnel}
            onNext={() => setCurrentStageIndex(prev => Math.min(prev + 1, funnel.stages.length - 1))}
            onPrevious={() => setCurrentStageIndex(prev => Math.max(prev - 1, 0))}
            isFirst={currentStageIndex === 0}
            isLast={currentStageIndex === funnel.stages.length - 1}
          />
        </Suspense>
      </div>
    </div>
  );
}

function FunnelLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
