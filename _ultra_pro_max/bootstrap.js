import { installSecurity } from "./security.js";
import { installPerformance } from "./performance.js";
import { installUX } from "./ux.js";
import { installMonitoring } from "./monitoring.js";

export function ultraBootstrap(app){
  installSecurity(app);
  installPerformance(app);
  installUX(app);
  installMonitoring(app);
  console.log("ULTRA PRO MAX ACTIVE");
}
