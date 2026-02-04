export function installSecurity(app){
  app.use((req,res,next)=>{
    res.setHeader("X-Frame-Options","DENY");
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Referrer-Policy","same-origin");
    next();
  });
}
