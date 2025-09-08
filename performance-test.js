#!/usr/bin/env node

/**
 * Performance testing script for Tool Canvas
 * Measures FCP, LCP, and other Core Web Vitals
 */

const { chromium } = require('playwright');

async function measurePerformance() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Enable performance metrics
  await page.coverage.startJSCoverage();

  // Navigate to the app
  const startTime = Date.now();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  // Wait for React to render
  await page.waitForSelector('.toolbar', { timeout: 5000 });

  // Get performance metrics
  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      // Use Performance Observer to get Core Web Vitals
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const metrics = {};

        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
          }
          if (entry.entryType === 'navigation') {
            metrics.domContentLoaded =
              entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            metrics.loadComplete = entry.loadEventEnd - entry.loadEventStart;
          }
        });

        resolve(metrics);
      });

      observer.observe({ entryTypes: ['paint', 'navigation'] });

      // Fallback: get basic timing
      setTimeout(() => {
        const timing = performance.timing;
        resolve({
          fcp: timing.domContentLoadedEventEnd - timing.navigationStart,
          lcp: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded:
            timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
          loadComplete: timing.loadEventEnd - timing.loadEventStart,
        });
      }, 1000);
    });
  });

  console.log('🚀 Performance Metrics:');
  console.log('========================');
  console.log(`⏱️  Total Load Time: ${loadTime}ms`);
  console.log(`🎨 First Contentful Paint: ${Math.round(metrics.fcp || 0)}ms`);
  console.log(
    `🖼️  Largest Contentful Paint: ${Math.round(metrics.lcp || 0)}ms`
  );
  console.log(
    `📄 DOM Content Loaded: ${Math.round(metrics.domContentLoaded || 0)}ms`
  );
  console.log(`✅ Load Complete: ${Math.round(metrics.loadComplete || 0)}ms`);

  // Performance recommendations
  console.log('\n📊 Performance Analysis:');
  console.log('========================');

  if (metrics.fcp < 1000) {
    console.log('✅ FCP: Excellent (< 1s)');
  } else if (metrics.fcp < 2000) {
    console.log('⚠️  FCP: Good (1-2s)');
  } else {
    console.log('❌ FCP: Needs improvement (> 2s)');
  }

  if (metrics.lcp < 2000) {
    console.log('✅ LCP: Excellent (< 2s)');
  } else if (metrics.lcp < 3000) {
    console.log('⚠️  LCP: Good (2-3s)');
  } else {
    console.log('❌ LCP: Needs improvement (> 3s)');
  }

  await browser.close();
}

// Run the performance test
measurePerformance().catch(console.error);
