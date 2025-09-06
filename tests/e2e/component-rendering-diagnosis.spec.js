import { test, expect } from '@playwright/test';

test.describe('Component Rendering Diagnosis Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Capture all errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', error => {
      errors.push(`Page error: ${error.message}`);
    });
    page.errors = errors;
  });

  test('should diagnose why SearchPage component fails to render', async ({ page }) => {
    // Step 1: Test basic React mounting
    await page.goto('/');
    
    // Wait for React to potentially mount
    await page.waitForTimeout(3000);
    
    // Check if React app root exists
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
    
    // Step 2: Check for JavaScript errors that prevent rendering
    const hasJSErrors = page.errors.length > 0;
    
    if (hasJSErrors) {
      console.log('❌ JavaScript Errors Found:');
      page.errors.forEach(error => console.log(`  - ${error}`));
      
      // Categorize error types
      const importErrors = page.errors.filter(e => e.includes('import') || e.includes('module'));
      const syntaxErrors = page.errors.filter(e => e.includes('Syntax') || e.includes('Unexpected'));
      const runtimeErrors = page.errors.filter(e => e.includes('TypeError') || e.includes('ReferenceError'));
      
      console.log(`Import errors: ${importErrors.length}`);
      console.log(`Syntax errors: ${syntaxErrors.length}`);
      console.log(`Runtime errors: ${runtimeErrors.length}`);
    }
    
    // Step 3: Test component dependency chain
    await test.step('Test Basic Component Mounting', async () => {
      // Should at least render MainLayout
      const nav = page.locator('nav');
      const hasNavigation = await nav.count() > 0;
      
      if (!hasNavigation) {
        throw new Error('MainLayout navigation not rendering - layout component failure');
      }
    });
    
    // Step 4: Test specific SearchPage issues
    await test.step('Diagnose SearchPage Specific Issues', async () => {
      // Try to find any SearchPage content
      const heroSection = page.locator('h1:has-text("Find Premium Raw Dog Food")');
      const hasHeroSection = await heroSection.count() > 0;
      
      if (!hasHeroSection) {
        // Test if it's a specific component dependency issue
        const possibleCauses = [];
        
        // Check for Leaflet/Map dependency issues
        const leafletErrors = page.errors.filter(e => 
          e.includes('leaflet') || e.includes('map') || e.includes('L is not defined')
        );
        if (leafletErrors.length > 0) {
          possibleCauses.push('Leaflet/Map dependency issue');
        }
        
        // Check for API service issues
        const apiErrors = page.errors.filter(e => 
          e.includes('api') || e.includes('axios') || e.includes('fetch')
        );
        if (apiErrors.length > 0) {
          possibleCauses.push('API service initialization issue');
        }
        
        // Check for context issues
        const contextErrors = page.errors.filter(e => 
          e.includes('useAuth') || e.includes('context') || e.includes('provider')
        );
        if (contextErrors.length > 0) {
          possibleCauses.push('React context/provider issue');
        }
        
        console.log('Possible SearchPage failure causes:', possibleCauses);
        throw new Error(`SearchPage not rendering. Possible causes: ${possibleCauses.join(', ')}`);
      }
    });
    
    // Step 5: Performance diagnosis
    await test.step('Performance Impact Analysis', async () => {
      const loadTime = await page.evaluate(() => performance.now());
      console.log(`Page load time: ${Math.round(loadTime)}ms`);
      
      if (loadTime > 5000) {
        console.log('⚠️ Slow loading detected - may indicate dependency bundling issues');
      }
    });
  });

  test('should test component isolation and dependencies', async ({ page }) => {
    // Navigate to a route that should work (debug page)
    await page.goto('/auth-test');
    
    await page.waitForTimeout(2000);
    
    // This should work if basic React/routing works
    const hasContent = await page.locator('body').textContent();
    const hasSubstantialContent = hasContent && hasContent.length > 100;
    
    if (!hasSubstantialContent) {
      throw new Error('Even simple components are not rendering - fundamental React/build issue');
    }
    
    console.log('✅ Basic React components can render');
  });

  test('should test specific dependency chains', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(3000);
    
    // Test dependency loading in isolation
    await test.step('Test Lucide React Icons', async () => {
      const icons = page.locator('svg[class*="lucide"]');
      const iconCount = await icons.count();
      
      if (iconCount === 0) {
        console.log('⚠️ Lucide React icons not found - but this may be expected if components not rendering');
      } else {
        console.log(`✅ Found ${iconCount} Lucide React icons rendering`);
      }
    });
    
    await test.step('Test Tailwind CSS', async () => {
      // Look for Tailwind classes being applied
      const elementsWithTailwind = page.locator('[class*="bg-"], [class*="text-"], [class*="px-"], [class*="py-"]');
      const tailwindCount = await elementsWithTailwind.count();
      
      if (tailwindCount === 0) {
        throw new Error('Tailwind CSS classes not found - CSS framework issue');
      } else {
        console.log(`✅ Found ${tailwindCount} elements with Tailwind classes`);
      }
    });
  });

  test('should create diagnostic report', async ({ page }) => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      errors: [],
      warnings: [],
      components: {
        react: false,
        router: false,
        mainLayout: false,
        searchPage: false
      },
      dependencies: {
        lucideReact: false,
        tailwindCSS: false,
        leaflet: false,
        axios: false
      },
      recommendations: []
    };
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Capture all errors
    diagnostics.errors = page.errors || [];
    
    // Test React
    const hasRoot = await page.locator('#root').isVisible();
    diagnostics.components.react = hasRoot;
    
    // Test Router
    const hasRouting = await page.url().includes('localhost:5173');
    diagnostics.components.router = hasRouting;
    
    // Test MainLayout
    const hasNav = await page.locator('nav').count() > 0;
    diagnostics.components.mainLayout = hasNav;
    
    // Test SearchPage
    const hasSearchPage = await page.locator('h1:has-text("Find Premium Raw Dog Food")').count() > 0;
    diagnostics.components.searchPage = hasSearchPage;
    
    // Test dependencies
    const iconCount = await page.locator('svg[class*="lucide"]').count();
    diagnostics.dependencies.lucideReact = iconCount > 0;
    
    const tailwindCount = await page.locator('[class*="bg-emerald"]').count();
    diagnostics.dependencies.tailwindCSS = tailwindCount > 0;
    
    // Generate recommendations
    if (!diagnostics.components.searchPage && diagnostics.components.mainLayout) {
      diagnostics.recommendations.push('SearchPage component has rendering issues - check dependencies');
    }
    
    if (diagnostics.errors.length > 0) {
      diagnostics.recommendations.push('JavaScript errors detected - fix errors first');
    }
    
    if (!diagnostics.dependencies.lucideReact && diagnostics.components.react) {
      diagnostics.recommendations.push('Lucide React icons not rendering - check icon component imports');
    }
    
    // Output diagnostic report
    console.log('\n🔍 COMPONENT RENDERING DIAGNOSTIC REPORT');
    console.log('='.repeat(50));
    console.log(JSON.stringify(diagnostics, null, 2));
    
    // Save to file for CI/CD
    await page.evaluate((report) => {
      localStorage.setItem('diagnosticReport', JSON.stringify(report));
    }, diagnostics);
    
    // Fail test if critical issues found
    if (!diagnostics.components.react) {
      throw new Error('Critical: React not initializing');
    }
    
    if (diagnostics.errors.length > 0) {
      throw new Error(`Critical: ${diagnostics.errors.length} JavaScript errors found`);
    }
  });
});