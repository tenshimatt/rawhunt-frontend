#!/usr/bin/env node

/**
 * Foundation Test Runner - CRITICAL FIRST CHECKS
 * 
 * This script runs all foundation tests that should NEVER fail.
 * If any of these tests fail, the application is fundamentally broken.
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

const TESTS = [
  {
    name: 'Unit Tests - Core Components',
    command: 'npm run test:run -- --reporter=verbose tests/unit/',
    critical: true
  },
  {
    name: 'CSP Validation Tests',
    command: 'npm run test:run -- --reporter=verbose tests/unit/csp-validation.test.js',
    critical: true
  },
  {
    name: 'E2E Foundation Tests',
    command: 'npx playwright test tests/e2e/homepage-foundation.spec.js',
    critical: true
  }
];

async function runTest(test) {
  console.log(chalk.blue(`\n🧪 Running: ${test.name}`));
  console.log(chalk.gray(`Command: ${test.command}`));
  
  try {
    const startTime = Date.now();
    const output = execSync(test.command, { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    const duration = Date.now() - startTime;
    
    console.log(chalk.green(`✅ ${test.name} - PASSED (${duration}ms)`));
    
    // Show detailed output for critical tests
    if (test.critical && process.env.VERBOSE) {
      console.log(chalk.gray(output));
    }
    
    return { success: true, name: test.name, duration };
  } catch (error) {
    console.log(chalk.red(`❌ ${test.name} - FAILED`));
    console.log(chalk.red(error.stdout || error.message));
    
    if (test.critical) {
      console.log(chalk.red('🚨 CRITICAL TEST FAILED - This indicates a fundamental issue!'));
    }
    
    return { success: false, name: test.name, error: error.message };
  }
}

async function checkServers() {
  console.log(chalk.blue('🔍 Checking development servers...'));
  
  const checkServer = async (url, name) => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        timeout: 5000
      });
      if (response.ok) {
        console.log(chalk.green(`✅ ${name} server is accessible`));
        return true;
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️  ${name} server is not accessible at ${url}`));
      console.log(chalk.gray(`   This may affect integration tests`));
      return false;
    }
    return false;
  };
  
  const servers = [
    { url: 'http://localhost:5173', name: 'Frontend' },
    { url: 'http://localhost:8787', name: 'Backend' }
  ];
  
  for (const server of servers) {
    await checkServer(server.url, server.name);
  }
}

async function main() {
  console.log(chalk.bold.blue('🚀 FOUNDATION TEST RUNNER - CRITICAL FIRST CHECKS'));
  console.log(chalk.gray('These tests validate that the application can load and run properly.'));
  console.log(chalk.gray('If any of these fail, the application is fundamentally broken.\n'));
  
  // Check server status
  await checkServers();
  
  const results = [];
  let totalDuration = 0;
  let criticalFailures = 0;
  
  // Run all tests
  for (const test of TESTS) {
    const result = await runTest(test);
    results.push(result);
    totalDuration += result.duration || 0;
    
    if (!result.success && test.critical) {
      criticalFailures++;
    }
  }
  
  // Summary
  console.log(chalk.bold('\n📊 TEST SUMMARY'));
  console.log(chalk.gray('='.repeat(50)));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(chalk.green(`Passed: ${passed}`));
  console.log(chalk.red(`Failed: ${failed}`));
  console.log(`Total Duration: ${Math.round(totalDuration / 1000)}s`);
  
  if (criticalFailures > 0) {
    console.log(chalk.red.bold(`\n🚨 ${criticalFailures} CRITICAL TEST(S) FAILED!`));
    console.log(chalk.red('The application has fundamental issues that must be fixed.'));
    process.exit(1);
  } else if (failed > 0) {
    console.log(chalk.yellow.bold(`\n⚠️  ${failed} test(s) failed, but no critical failures.`));
    process.exit(1);
  } else {
    console.log(chalk.green.bold('\n✅ ALL FOUNDATION TESTS PASSED!'));
    console.log(chalk.green('The application is ready for further development and testing.'));
    process.exit(0);
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.log(chalk.red('💥 Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(chalk.red('💥 Unhandled Rejection:'), reason);
  process.exit(1);
});

// Run the test suite
main().catch((error) => {
  console.log(chalk.red('💥 Test Runner Failed:'), error.message);
  process.exit(1);
});