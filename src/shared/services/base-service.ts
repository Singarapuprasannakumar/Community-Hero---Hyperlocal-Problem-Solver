export async function simulateNetwork<T>(data: T, failRate = 0.02): Promise<T> {
  // Simulate latency between 150ms and 600ms
  const delay = Math.random() * 450 + 150;
  await new Promise((resolve) => setTimeout(resolve, delay));
  
  if (Math.random() < failRate) {
    throw new Error("Network request failed. Please check your connection and try again.");
  }
  
  return data;
}
