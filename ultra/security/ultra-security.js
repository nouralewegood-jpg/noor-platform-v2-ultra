/**
 * Ultra Security Module - منصة نور الذكية
 * يوفر حماية متقدمة للبيانات والاتصالات
 */

export function sanitizeAll(obj) {
  if (typeof obj === "string") {
    return obj
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  }
  if (typeof obj === "object" && obj !== null) {
    for (const k in obj) {
      obj[k] = sanitizeAll(obj[k]);
    }
  }
  return obj;
}

export function secureHeaders(res) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
}

export function validateInput(input, rules = {}) {
  const errors = [];
  
  if (rules.required && !input) {
    errors.push("هذا الحقل مطلوب");
  }
  
  if (rules.email && input && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
    errors.push("البريد الإلكتروني غير صحيح");
  }
  
  if (rules.minLength && input && input.length < rules.minLength) {
    errors.push(`يجب أن يكون الطول على الأقل ${rules.minLength} أحرف`);
  }
  
  if (rules.maxLength && input && input.length > rules.maxLength) {
    errors.push(`يجب ألا يتجاوز الطول ${rules.maxLength} أحرف`);
  }
  
  if (rules.pattern && input && !rules.pattern.test(input)) {
    errors.push("الصيغة غير صحيحة");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function encryptSensitive(data) {
  // في الإنتاج، استخدم مكتبة تشفير حقيقية مثل crypto-js
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

export function decryptSensitive(encrypted) {
  try {
    return JSON.parse(Buffer.from(encrypted, "base64").toString("utf-8"));
  } catch (error) {
    console.error("فشل فك التشفير:", error);
    return null;
  }
}

export function generateSecureToken(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function rateLimit(key, maxRequests = 100, windowMs = 60000) {
  const store = new Map();
  
  return function checkRateLimit() {
    const now = Date.now();
    
    if (!store.has(key)) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    const data = store.get(key);
    
    if (now > data.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    data.count++;
    
    if (data.count > maxRequests) {
      return { allowed: false, remaining: 0, resetTime: data.resetTime };
    }
    
    return { allowed: true, remaining: maxRequests - data.count };
  };
}

export function validateSession(session) {
  if (!session || !session.userId) {
    return { valid: false, error: "جلسة غير صحيحة" };
  }
  
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    return { valid: false, error: "انتهت صلاحية الجلسة" };
  }
  
  return { valid: true };
}
