# 🚀 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment of your HealthBridge application.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features are working in local development
- [ ] No console errors in browser
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables are documented
- [ ] Firebase configuration is correct

### Git Repository
- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` includes `node_modules`, `.env`, and `dist`
- [ ] README.md is up to date

### Firebase Setup
- [ ] Firebase project is created
- [ ] Authentication is enabled
- [ ] Firestore database is set up
- [ ] Storage is configured
- [ ] Security rules are defined

## Deployment Checklist

### Vercel Account
- [ ] Vercel account created
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged into Vercel CLI (`vercel login`)

### Project Import
- [ ] Repository imported to Vercel
- [ ] Framework preset: **Vite**
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `./`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_MEASUREMENT_ID`

### Build Configuration
- [ ] `vercel.json` file created
- [ ] Build settings configured
- [ ] Rewrites for SPA routing configured
- [ ] `.vercelignore` file created

## Post-Deployment Checklist

### Firebase Configuration
- [ ] Vercel domain added to Firebase authorized domains
- [ ] CORS configured for Storage (if using file uploads)
- [ ] Firestore indexes created (if needed)
- [ ] Security rules tested

### Testing
- [ ] Homepage loads successfully
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard accessible
- [ ] Appointment booking works
- [ ] Profile settings accessible
- [ ] File uploads work (profile photos)
- [ ] Multi-language switching works
- [ ] All routes accessible (no 404s)
- [ ] Mobile responsive design works
- [ ] PWA features work

### Performance
- [ ] Lighthouse score checked
- [ ] Core Web Vitals acceptable
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] Loading times acceptable

### Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Firebase security rules reviewed
- [ ] API keys secured
- [ ] CORS configured properly
- [ ] No sensitive data in client code

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking set up
- [ ] Performance monitoring configured
- [ ] Firebase usage monitored

### Documentation
- [ ] Deployment URL documented
- [ ] Admin credentials secured
- [ ] User guide updated
- [ ] API documentation (if applicable)

## Custom Domain Setup (Optional)

- [ ] Domain purchased
- [ ] Domain added in Vercel
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain added to Firebase authorized domains
- [ ] Redirects configured (www to non-www)

## Continuous Deployment

- [ ] Auto-deploy on push to main enabled
- [ ] Preview deployments for PRs enabled
- [ ] Build notifications configured
- [ ] Deployment protection configured

## Rollback Plan

- [ ] Previous deployment URLs saved
- [ ] Instant rollback tested
- [ ] Database backup strategy defined
- [ ] Incident response plan documented

## Launch Checklist

- [ ] Final testing completed
- [ ] Team notified
- [ ] Users notified (if applicable)
- [ ] Social media announced
- [ ] Analytics tracking verified
- [ ] Support channels ready

## Quick Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Remove a deployment
vercel remove [deployment-name]

# Check project info
vercel inspect
```

## Emergency Contacts

- Vercel Support: https://vercel.com/support
- Firebase Support: https://firebase.google.com/support
- GitHub Support: https://support.github.com

## Notes

- Deployment URL: ____________________________
- Custom Domain: ____________________________
- Deployed Date: ____________________________
- Deployed By: ____________________________

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Completed

**Deployment Status**: ________________

**Next Review Date**: ________________
