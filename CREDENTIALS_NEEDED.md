# 🔑 Shopify API Credentials Needed

To complete the Hydrogen deployment, please provide the following credentials from your Shopify store.

---

## ✅ CRITICAL - Required for Basic Functionality

### 1. **SESSION_SECRET** ⚠️ MISSING
**What it is**: A random string used to encrypt session cookies

**How to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example**: `x7K9mN2pQ4vR8sT5wY1zA3bC6dE0fG9h...`

---

### 2. **PUBLIC_CHECKOUT_DOMAIN** ⚠️ MISSING
**What it is**: Your store's checkout domain

**Where to find**:
- Shopify Admin → Settings → Domains
- If using custom domain: `checkout.yourdomain.com`
- If using Shopify domain: `dtf2yg-gg.myshopify.com`

**Example**: `dtf2yg-gg.myshopify.com` OR `yourdomain.com`

---

## ⚡ RECOMMENDED - For Full Features

### 3. **PRIVATE_ADMIN_API_TOKEN** (Admin API)
**What it is**: Token for server-side admin operations (orders, inventory, etc.)

**Where to get**:
1. Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps"
3. Create app or select existing app
4. Click "API credentials"
5. Under "Admin API access token" → Reveal token

**Scopes needed**:
- `read_products`
- `read_orders`
- `read_customers`
- `write_products` (if needed)

---

### 4. **Customer Account API** (For Customer Login)

**PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID**
**PUBLIC_CUSTOMER_ACCOUNT_API_URL**

**Where to get**:
1. Shopify Admin → Settings → Customer accounts
2. Enable "New customer accounts"
3. Get Client ID and URL from app configuration

**If you don't have this**: Customer login won't work

---

### 5. **PRIVATE_STOREFRONT_API_TOKEN** (Optional but recommended)
**What it is**: Private token for server-side storefront queries (better performance)

**Where to get**: Same place as PUBLIC_STOREFRONT_API_TOKEN but use the private one

---

## 📋 Current Configuration Status

From your `.env.production`:

```
✅ PUBLIC_STORE_DOMAIN: dtf2yg-gg.myshopify.com
✅ PUBLIC_STOREFRONT_API_TOKEN: a88c676928bb48d85932b020f9bca464
❌ SESSION_SECRET: MISSING (CRITICAL)
❌ PUBLIC_CHECKOUT_DOMAIN: MISSING (CRITICAL)
❌ PRIVATE_ADMIN_API_TOKEN: MISSING (recommended)
❌ Customer Account API: MISSING (needed for login)
```

---

## 🎯 What to Provide

Please provide these values and I'll update the `.env` file:

### Critical (deployment will fail without these):
1. **SESSION_SECRET**: `[generate with command above]`
2. **PUBLIC_CHECKOUT_DOMAIN**: `dtf2yg-gg.myshopify.com` OR `your-custom-domain.com`

### Recommended (for full functionality):
3. **PRIVATE_ADMIN_API_TOKEN**: `shpat_xxxxxxxxxxxxx`
4. **PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID**: `shp_xxxxx`
5. **PUBLIC_CUSTOMER_ACCOUNT_API_URL**: `https://shopify.com/xxxxx`

### Optional:
6. **PRIVATE_STOREFRONT_API_TOKEN**: `shpat_xxxxx`
7. **PUBLIC_STOREFRONT_ID**: `gid://shopify/...`
8. **SHOP_ID**: Your shop ID number

---

## 🔒 Security Notes

- **Never commit `.env` to Git** (already in `.gitignore`)
- For Oxygen deployment, set these in: Shopify Admin → Hydrogen app → Environment variables
- Use different values for development vs production
- Rotate tokens if exposed

---

## 🚀 After You Provide Credentials

I will:
1. Update the `.env` file with your credentials
2. Test locally to verify connection
3. Update Oxygen environment variables
4. Deploy successfully

**Ready when you are!** 🎊
