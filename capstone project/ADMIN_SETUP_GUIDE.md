# Admin Setup Guide - Quick Reference

## 🚀 Admin User Kaise Banaye (3 Steps)

### Step 1: Create Admin Page Pe Jao
```
http://localhost:5173/create-admin
```

### Step 2: Create Admin Button Click Karo
- Default credentials already filled hain
- Ya apne credentials daal sakte ho
- "Create Admin" button click karo

### Step 3: Login Karo
- Logout karo (agar logged in ho)
- Login page pe jao
- Admin credentials use karo:
  - **Email:** `admin@duniyamart.com`
  - **Password:** `Admin@123456`

## ✅ Admin Ban Gaye! Ab Kya Karein?

### Seller Approve Karna:
1. `/admin/approvals` pe jao
2. Pending sellers list dikhegi
3. "Approve" button click karo
4. Done! Seller ab products add kar sakta hai

### Admin Dashboard Access:
- Dashboard: `/admin/dashboard`
- Approvals: `/admin/approvals`

## 🎯 Complete Flow

```
1. Create Admin (/create-admin)
   ↓
2. Login with admin credentials
   ↓
3. Go to /admin/approvals
   ↓
4. Approve pending sellers
   ↓
5. Sellers can now add products!
```

## 💡 Pro Tips

- Admin credentials change kar sakte ho create karne se pehle
- Ek baar admin ban gaye toh directly login kar sakte ho
- Admin dashboard se sab kuch manage kar sakte ho

## 🔑 Default Credentials (Yaad Rakhna!)

```
Email:    admin@duniyamart.com
Password: Admin@123456
```

## ❓ Common Issues

**Q: Admin create nahi ho raha?**
A: Check karo email already exist toh nahi karta

**Q: Login ke baad admin dashboard nahi dikh raha?**
A: URL manually type karo: `/admin/dashboard`

**Q: Seller approve nahi ho raha?**
A: Refresh karo page, phir try karo

---

**Bas itna hi! Simple hai! 🎉**
