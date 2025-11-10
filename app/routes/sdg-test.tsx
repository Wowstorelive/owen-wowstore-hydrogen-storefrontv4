import { AIPersonalizedSDGSelector } from '~/components/AIPersonalizedSDGSelector';
import '~/styles/ai-sdg-selector.css';

export default function SDGTest() {
  const handleCharitySelected = (charityId: string) => {
    console.log('Charity selected:', charityId);
    alert(`You selected charity: ${charityId}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        SDG Charity Selector Test
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
        Testing the AI-powered personalized charity recommendation component
      </p>
      
      <AIPersonalizedSDGSelector
        customerId="test_customer_123"
        sessionId="test_session_456"
        onCharitySelected={handleCharitySelected}
      />
    </div>
  );
}
