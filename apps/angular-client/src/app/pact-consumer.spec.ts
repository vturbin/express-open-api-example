import { Pact, Matchers } from '@pact-foundation/pact';
import { iso8601DateTimeWithMillis } from '@pact-foundation/pact/src/dsl/matchers';
import axios from 'axios';

const { like, iso8601DateTime } = Matchers; // ✅ Use flexible matchers

const provider = new Pact({
  consumer: 'AngularApp',
  provider: 'OrderService',
  port: 3000,
  log: './pact/logs/mockserver.log',
  dir: './pact/pacts',
  logLevel: 'info',
});

describe('Pact with OrderService', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  it('should receive a list of orders', async () => {
    await provider.addInteraction({
      state: 'Orders exist',
      uponReceiving: 'a request for orders',
      withRequest: {
        method: 'GET',
        path: '/orders',
      },
      willRespondWith: {
        status: 200,
        body: [
          {
            id: like('1'), // ✅ Ensures `id` exists and is a string
            customerName: like('Jessica'), // ✅ Ensures `customerName` exists
            totalAmount: like(100), // ✅ Ensures `totalAmount` exists and is a number
            status: like('pending'), // ✅ Ensures `status` is a valid string
            createdAt: iso8601DateTimeWithMillis(), // ✅ Ensures `createdAt` exists & is a valid ISO timestamp
          },
        ],
      },
    });

    // 🔹 Simulate frontend API call
    const response = await axios.get(`${provider.mockService.baseUrl}/orders`);

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
    expect(typeof response.data[0].createdAt).toBe('string'); // ✅ Only checks type, not value

    await provider.verify();
  });
});
