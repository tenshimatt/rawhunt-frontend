// Global setup for Playwright tests
async function globalSetup(config) {
  console.log('🚀 Starting Playwright Global Setup...');
  
  // Check if development servers are running
  const checkServer = async (url, name) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${name} server is running at ${url}`);
        return true;
      }
    } catch (error) {
      console.log(`❌ ${name} server is not accessible at ${url}`);
      return false;
    }
    return false;
  };

  // Wait for servers to be ready
  const maxAttempts = 60; // 60 seconds
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const frontendReady = await checkServer('http://localhost:5173', 'Frontend');
    const backendReady = await checkServer('http://localhost:8787', 'Backend');
    
    if (frontendReady) {
      console.log('🎯 All required servers are ready!');
      break;
    }
    
    attempts++;
    console.log(`⏳ Waiting for servers... (${attempts}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (attempts >= maxAttempts) {
    console.error('💥 Servers failed to start within timeout period');
    throw new Error('Development servers are not accessible');
  }
  
  // Additional setup tasks
  console.log('🔧 Performing additional setup tasks...');
  
  // Store test data or configuration
  process.env.TEST_START_TIME = Date.now().toString();
  
  console.log('✅ Global setup completed successfully!');
}

export default globalSetup;