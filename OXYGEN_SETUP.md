# 🚀 Oxygen Environment Variables Setup

After deploying to Oxygen, you need to set these environment variables in the Shopify dashboard.

---

## 📍 Where to Set Variables

1. Go to: **Shopify Admin → Apps → Hydrogen (your app)**
2. Click on: **Environment variables**
3. Select: **Production** environment
4. Add each variable below

---

## ✅ Required Environment Variables

Copy these **exact names and values** into Oxygen:

### Store Configuration
```
PUBLIC_STORE_DOMAIN
dtf2yg-gg.myshopify.com
```

```
PUBLIC_CHECKOUT_DOMAIN
wowstore.live
```

```
SHOP_ID
1000059146
```

### API Tokens
```
PUBLIC_STOREFRONT_API_TOKEN
[use your public token from Shopify Admin]
```

```
PRIVATE_STOREFRONT_API_TOKEN
[use your private token from Shopify Admin]
```

```
PRIVATE_ADMIN_API_TOKEN
[use your admin API token from Shopify Admin]
```

```
PRIVATE_ADMIN_API_VERSION
2025-01
```

### Session & Security
```
SESSION_SECRET
[use the generated SESSION_SECRET from .env file]
```

### Customer Account API
```
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
[use your Customer Account API Client ID]
```

```
PUBLIC_CUSTOMER_ACCOUNT_API_URL
[use your Customer Account API URL]
```

---

## 🔄 Alternative: Use Shopify CLI

You can also set these via CLI:

```bash
cd /workspaces/owen-wowstore-hydrogen-storefrontv4

# This command will push all variables from .env to Oxygen
npx shopify hydrogen env push
```

---

## ⚠️ Important Notes

1. **Never commit `.env` to Git** (already in `.gitignore`)
2. **Separate environments**: Use different tokens for development vs production if needed
3. **After setting variables**: Redeploy your app for changes to take effect
4. **Check logs**: Oxygen dashboard → Logs to verify variables are loaded

---

## ✅ Verification

After setting variables and deploying, check:

- [ ] Storefront loads at your domain
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Checkout redirects properly
- [ ] Customer login works
- [ ] No console errors about missing env vars

---

## 🆘 Troubleshooting

**If deployment fails with "SESSION_SECRET not set":**
- Make sure the variable is set in Oxygen dashboard
- Redeploy after adding variables

**If products don't load:**
- Verify `PUBLIC_STOREFRONT_API_TOKEN` is correct
- Check token has proper scopes in Shopify Admin

**If checkout doesn't work:**
- Verify `PUBLIC_CHECKOUT_DOMAIN` matches your domain
- Ensure domain is configured in Shopify settings

---

All set! 🎊
