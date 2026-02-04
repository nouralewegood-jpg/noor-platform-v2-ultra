const cache = new Map();

export function cached(key, ttl, fn){
  const now = Date.now();
  if(cache.has(key)){
    const v = cache.get(key);
    if(now < v.exp) return v.data;
  }
  const data = fn();
  cache.set(key,{data,exp:now+ttl});
  return data;
}

export function installPerformance(){
  console.log("performance layer ready");
}
