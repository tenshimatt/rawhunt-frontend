import { test, expect } from '@playwright/test';

test.describe('Homepage Foundation Tests - CRITICAL FIRST CHECKS', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console errors for CSP and other issues
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.consoleErrors = consoleErrors;

    // Capture network failures
    const networkFailures = [];
    page.on('response', response => {
      if (!response.ok() && response.status() >= 400) {
        networkFailures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    page.networkFailures = networkFailures;
  });

  test('should load homepage without CSP violations', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to mount
    await expect(page.locator('#root')).toBeVisible();
    
    // Check for CSP violations in console
    const cspErrors = page.consoleErrors.filter(error => 
      error.includes('Content Security Policy') || 
      error.includes('Refused to load')
    );
    
    expect(cspErrors).toHaveLength(0);
    
    if (cspErrors.length > 0) {
      console.log('CSP Violations Found:', cspErrors);
    }
  });

  test('should load all critical fonts and icons without errors', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for font loading errors
    const fontErrors = page.consoleErrors.filter(error => 
      error.includes('font') || 
      error.includes('woff') || 
      error.includes('data:font')
    );
    
    expect(fontErrors).toHaveLength(0);
    
    // Verify Lucide React icons are loaded (they should render as SVGs)
    const iconElements = page.locator('svg[class*="lucide"]');
    if (await iconElements.count() > 0) {
      await expect(iconElements.first()).toBeVisible();
    }
  });

  test('should have no JavaScript errors on initial load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to mount and initial rendering
    await page.waitForTimeout(2000);
    
    // Filter out CSP errors (tested separately) and focus on JS errors
    const jsErrors = page.consoleErrors.filter(error => 
      !error.includes('Content Security Policy') &&
      !error.includes('Refused to load') &&
      (error.includes('TypeError') || 
       error.includes('ReferenceError') ||
       error.includes('SyntaxError') ||
       error.includes('Error:'))
    );
    
    expect(jsErrors).toHaveLength(0);
    
    if (jsErrors.length > 0) {
      console.log('JavaScript Errors Found:', jsErrors);
    }
  });

  test('should load all static resources successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all network requests to complete
    await page.waitForLoadState('networkidle');
    
    // Check for failed resource loads
    const criticalFailures = page.networkFailures.filter(failure => 
      failure.url.includes('.js') || 
      failure.url.includes('.css') ||
      failure.url.includes('.woff') ||
      failure.url.includes('.svg')
    );
    
    expect(criticalFailures).toHaveLength(0);
    
    if (criticalFailures.length > 0) {
      console.log('Critical Resource Failures:', criticalFailures);
    }
  });

  test('should render React app with proper routing', async ({ page }) => {
    await page.goto('/');
    
    // Verify React app mounted
    await expect(page.locator('#root')).toBeVisible();
    
    // Verify we're on the search page (homepage defaults to SearchPage)
    await expect(page.locator('body')).not.toHaveClass('error');
    
    // Check that we're not on an error page
    const notFoundElement = page.locator('text="404"');
    expect(await notFoundElement.count()).toBe(0);
    
    // Verify basic page structure exists
    const mainContent = page.locator('main, [role="main"], #root > div');
    await expect(mainContent.first()).toBeVisible();
  });

  test('should have working navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for common navigation patterns
    const possibleNavs = [
      'nav',
      '[role="navigation"]',
      'header nav',
      '.navigation',
      '.navbar',
      '.menu'
    ];
    
    let navFound = false;
    for (const selector of possibleNavs) {
      const nav = page.locator(selector);
      if (await nav.count() > 0) {
        await expect(nav.first()).toBeVisible();
        navFound = true;
        break;
      }
    }
    
    // If no nav found, at least verify the page has some interactive elements
    if (!navFound) {
      const interactiveElements = page.locator('button, a, input, [role="button"]');
      expect(await interactiveElements.count()).toBeGreaterThan(0);
    }
  });

  test('should handle backend connectivity gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial page load
    await page.waitForLoadState('networkidle');
    
    // Check if any API calls were made and failed
    const apiFailures = page.networkFailures.filter(failure => 
      failure.url.includes('/api/') ||
      failure.url.includes('localhost:8787')
    );
    
    // If API calls failed, the page should still render gracefully
    if (apiFailures.length > 0) {
      console.log('API Failures detected (this is OK for disconnected testing):', apiFailures);
    }
    
    // Verify page still shows something meaningful even if backend is down
    await expect(page.locator('#root')).toBeVisible();
    const pageContent = await page.locator('body').textContent();
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('should have proper CSP headers configured', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check if CSP is configured (either in headers or meta tag)
    const headers = response.headers();
    const hasCspHeader = headers['content-security-policy'] || headers['content-security-policy-report-only'];
    
    if (!hasCspHeader) {
      // Check for CSP meta tag
      const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]');
      await expect(cspMeta).toBeVisible();
      
      const cspContent = await cspMeta.getAttribute('content');
      expect(cspContent).toContain('font-src');
      expect(cspContent).toContain('data:'); // Allow data URIs for fonts
    }
  });

  test('should complete initial render within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await expect(page.locator('#root')).toBeVisible();
    
    // Wait for React to finish initial render
    await page.waitForTimeout(1000);
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Page should load within 10 seconds (generous for CI environments)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Homepage loaded in ${loadTime}ms`);
  });

  test('should have no accessibility violations on core elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Basic accessibility checks
    const mainContent = page.locator('main, [role="main"], #root > div').first();
    await expect(mainContent).toBeVisible();
    
    // Check for basic semantic structure
    const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
    if (hasHeadings) {
      const firstHeading = page.locator('h1, h2, h3').first();
      await expect(firstHeading).toBeVisible();
    }
    
    // Verify no elements have broken aria attributes
    const brokenAria = page.locator('[aria-labelledby=""], [aria-describedby=""]');
    expect(await brokenAria.count()).toBe(0);
  });
});