import { useState, useEffect } from 'react';
import '~/styles/ai-sdg-selector.css';

interface Charity {
  id: string;
  name: string;
  matchScore: number;
  sdgAlignment: number[];
  impactMetric?: string;
  socialProof?: number;
  whyRecommended?: string;
}

interface AIPersonalizedSDGSelectorProps {
  customerId?: string;
  sessionId: string;
  onCharitySelected: (charityId: string) => void;
  className?: string;
}

export function AIPersonalizedSDGSelector({
  customerId,
  sessionId,
  onCharitySelected,
  className = '',
}: AIPersonalizedSDGSelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null);

  useEffect(() => {
    fetchCharities();
  }, [customerId, sessionId]);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sdg/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId || `guest_${Date.now()}`,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setCharities(data.recommendedCharities || []);

    } catch (err) {
      console.error('Error fetching charities:', err);
      setError('Unable to load charity recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (charityId: string) => {
    setSelectedCharityId(charityId);
    onCharitySelected(charityId);
  };

  if (loading) {
    return (
      <div className="sdg-selector-loading">
        <div className="spinner"></div>
        <p>Finding perfect charities for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sdg-selector-error">
        <p>{error}</p>
        <button onClick={fetchCharities}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={`sdg-selector ${className}`}>
      <div className="sdg-selector-header">
        <h2>Choose a Charity to Support</h2>
        <p>We have personalized these recommendations based on your interests</p>
      </div>

      <div className="charity-grid">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className={`charity-card ${selectedCharityId === charity.id ? 'selected' : ''}`}
          >
            <div className="match-badge">
              {Math.round(charity.matchScore * 100)}% Match
            </div>

            <h3 className="charity-name">{charity.name}</h3>

            <div className="sdg-badge">
              SDG {charity.sdgAlignment[0]}: {getSDGName(charity.sdgAlignment[0])}
            </div>

            {charity.whyRecommended && (
              <p className="charity-description">{charity.whyRecommended}</p>
            )}

            <button
              className="select-button"
              onClick={() => handleSelect(charity.id)}
            >
              {selectedCharityId === charity.id ? '✓ Selected' : 'Select This Charity'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSDGName(goal: number): string {
  const sdgNames: Record<number, string> = {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health and Well-being',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water and Sanitation',
    7: 'Affordable and Clean Energy',
    8: 'Decent Work and Economic Growth',
    9: 'Industry, Innovation and Infrastructure',
    10: 'Reduced Inequalities',
    11: 'Sustainable Cities and Communities',
    12: 'Responsible Consumption and Production',
    13: 'Climate Action',
    14: 'Life Below Water',
    15: 'Life on Land',
    16: 'Peace, Justice and Strong Institutions',
    17: 'Partnerships for the Goals',
  };
  return sdgNames[goal] || `Goal ${goal}`;
}
