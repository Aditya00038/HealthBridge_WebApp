# Setting Up Real Health News API 🗞️

This guide will help you integrate real health news into the HealthNews page.

## 📋 Steps to Get Real News

### Option 1: NewsAPI.org (Recommended - Easy & Free)

1. **Sign Up**
   - Visit: https://newsapi.org/register
   - Enter your name and email
   - Verify your email

2. **Get API Key**
   - After verification, you'll receive your API key
   - It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

3. **Add to Project**
   - Open your `.env` file (create if it doesn't exist)
   - Add this line:
     ```
     VITE_NEWS_API_KEY=your_actual_api_key_here
     ```

4. **Restart Dev Server**
   ```bash
   npm run dev
   ```

**Free Tier:**
- ✅ 100 requests per day
- ✅ Perfect for development
- ✅ Access to 80,000+ news sources
- ✅ Indian news sources included

### Option 2: GNews API (Alternative)

1. **Sign Up**: https://gnews.io/
2. **Get API Key**: Free 100 requests/day
3. **Update Code**: 
   ```javascript
   // In HealthNews.jsx, replace the fetch URL with:
   `https://gnews.io/api/v4/search?q=${selectedNewsCategory}+India&lang=en&max=12&apikey=${apiKey}`
   ```

### Option 3: NewsData.io (Most Generous Free Tier)

1. **Sign Up**: https://newsdata.io/register
2. **Get API Key**: Free 200 requests/day
3. **Update Code**:
   ```javascript
   // In HealthNews.jsx, replace the fetch URL with:
   `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${selectedNewsCategory}&language=en&country=in`
   ```

## 🎯 Current Features

### Without API Key (Demo Mode)
- ✅ Shows 6 curated health articles
- ✅ All features work locally
- ✅ No external dependencies

### With API Key (Live Mode)
- ✅ Real-time health news from India and worldwide
- ✅ Multiple category filters
- ✅ Pagination (12 articles per page)
- ✅ Auto-refresh on category change
- ✅ Source attribution
- ✅ External article links

## 📱 News Categories Available

1. **Health** - General health news
2. **Medical** - Medical research and breakthroughs
3. **Healthcare** - Healthcare industry news
4. **Wellness** - Wellness and fitness
5. **Mental Health** - Mental health awareness
6. **Vaccination** - Vaccination updates

## 🔧 Troubleshooting

### Issue: "Failed to fetch news"
**Solution:** 
- Check if API key is correctly added to `.env`
- Restart dev server after adding `.env`
- Verify API key is active on NewsAPI dashboard

### Issue: "429 Too Many Requests"
**Solution:**
- You've hit the daily limit (100 requests)
- Wait 24 hours or upgrade plan
- App will fallback to demo articles automatically

### Issue: No images showing
**Solution:**
- Some articles don't have images
- App automatically uses fallback images
- This is normal behavior

## 💡 Pro Tips

1. **Cache Results**: Store fetched news in localStorage to reduce API calls
2. **Use Wisely**: Free tier has 100 requests/day - each category change = 1 request
3. **Production**: Consider upgrading to paid plan for live deployment
4. **Alternatives**: Can also integrate RSS feeds from health websites

## 📊 API Comparison

| API | Free Requests | Sources | Indian News | Best For |
|-----|---------------|---------|-------------|----------|
| NewsAPI | 100/day | 80,000+ | ✅ Yes | Development |
| GNews | 100/day | 60,000+ | ✅ Yes | Simple Setup |
| NewsData.io | 200/day | 50,000+ | ✅ Yes | More Requests |

## 🚀 Going to Production

For production deployment (Vercel):

1. **Add Environment Variable in Vercel**:
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add: `VITE_NEWS_API_KEY` = `your_api_key`
   - Redeploy

2. **Consider Upgrading**:
   - NewsAPI Developer plan: $449/month (unlimited)
   - Or implement server-side caching
   - Or use free tier with smart caching

## 📝 Example .env File

```env
# Firebase Config
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# News API (Add this line)
VITE_NEWS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

## ✅ Verification Steps

1. Add API key to `.env`
2. Restart server: `npm run dev`
3. Go to Health News page
4. Click "Health News" tab
5. Should see loading spinner, then real articles
6. Check browser console for success message

## 🎉 Success!

Once configured, you'll see:
- ✅ Real-time news articles
- ✅ Category filtering works
- ✅ Pagination enabled
- ✅ External article links
- ✅ Professional news sources

---

**Need Help?** Check the browser console for error messages or API responses.
