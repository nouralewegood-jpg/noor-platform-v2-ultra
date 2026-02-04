/**
 * Failsafe Fetch - استدعاء آمن للـ API
 * إعادة محاولة تلقائية ومعالجة الأخطاء
 */

export async function safeFetch(url, opt = {}, tries = 3) {
  let lastError;
  
  for (let i = 0; i < tries; i++) {
    try {
      const timeout = opt.timeout || 10000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...opt,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // لا تحاول مرة أخرى إذا كان الخطأ 4xx (ما عدا 429)
      if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      if (i < tries - 1) {
        // انتظر قبل المحاولة التالية (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("فشل الاستدعاء بعد عدة محاولات");
}

export async function safeFetchJSON(url, opt = {}, tries = 3) {
  const response = await safeFetch(url, opt, tries);
  return response.json();
}

export async function safeFetchWithFallback(url, fallbackData, opt = {}) {
  try {
    return await safeFetchJSON(url, opt, 2);
  } catch (error) {
    console.warn(`فشل جلب ${url}، استخدام البيانات الاحتياطية:`, error);
    return fallbackData;
  }
}

export class APIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 10000;
    this.retries = options.retries || 3;
    this.headers = options.headers || {};
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const opt = {
      ...options,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...options.headers,
      },
    };
    
    return safeFetch(url, opt, this.retries);
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }
  
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
  
  async getJSON(endpoint, options = {}) {
    const response = await this.get(endpoint, options);
    return response.json();
  }
  
  async postJSON(endpoint, data, options = {}) {
    const response = await this.post(endpoint, data, options);
    return response.json();
  }
}

export async function batchFetch(requests, options = {}) {
  const results = await Promise.allSettled(
    requests.map(req => 
      safeFetch(req.url, req.options || {}, options.retries || 3)
    )
  );
  
  return results.map((result, index) => ({
    url: requests[index].url,
    status: result.status,
    data: result.status === "fulfilled" ? result.value : null,
    error: result.status === "rejected" ? result.reason : null,
  }));
}
