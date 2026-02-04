import fetch from 'node-fetch';

export async function testAllRoutes(baseUrl) {
  const routes = [
    '/',
    '/api/trpc/health',
  ];
  
  const report = [];
  for (const route of routes) {
    try {
      const res = await fetch(`${baseUrl}${route}`);
      report.push({
        route,
        status: res.status,
        ok: res.ok,
        testedAt: new Date().toISOString()
      });
    } catch (e) {
      report.push({
        route,
        error: e.message,
        ok: false,
        testedAt: new Date().toISOString()
      });
    }
  }
  return report;
}
