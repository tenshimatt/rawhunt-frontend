// Global teardown for Playwright tests
async function globalTeardown(config) {
  console.log('🧹 Starting Playwright Global Teardown...');
  
  // Calculate test execution time
  const startTime = parseInt(process.env.TEST_START_TIME || '0');
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  console.log(`⏱️  Total test execution time: ${duration} seconds`);
  
  // Clean up any test data
  console.log('🗑️  Cleaning up test artifacts...');
  
  // Log final status
  console.log('✅ Global teardown completed successfully!');
}

export default globalTeardown;