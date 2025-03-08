import { Verifier } from '@pact-foundation/pact';
import axios from 'axios'; // ✅ Use axios for API calls

const API_BASE_URL = 'http://localhost:3000';
let testOrderId: string; // Store order ID to delete it later

describe('Pact Verification for OrderService', () => {
  beforeAll(async () => {
    console.log('🛠️ Creating test order...');

    const response = await axios.post(`${API_BASE_URL}/orders`, {
      customerName: 'Jessica', // ✅ Matches Pact expectation
      totalAmount: 100,
    });

    testOrderId = response.data.id; // ✅ Store the ID for cleanup
    console.log(`✅ Test order created with ID: ${testOrderId}`);
  });

  afterAll(async () => {
    console.log(`🧹 Deleting test order with ID: ${testOrderId}`);

    if (testOrderId) {
      await axios.delete(`${API_BASE_URL}/orders/${testOrderId}`);
      console.log('✅ Test order deleted');
    }
  });

  it('should validate the API against consumer expectations', async () => {
    await new Verifier({
      providerBaseUrl: API_BASE_URL,
      pactUrls: ['./pact/pacts/angularapp-orderservice.json'],
      provider: 'OrderService',
      publishVerificationResult: true,
      providerVersion: '1.0.0',
    }).verifyProvider();
  });
});
