# 🔍 Prescription Troubleshooting Guide

## ⚠️ Issue: Prescriptions Not Showing

**Firebase Index**: ✅ Enabled (from screenshot)
**Status**: Investigating data issues

---

## 🛠️ Debug Steps

### **Step 1: Open Debug Page**

Go to: **http://localhost:3001/patient/prescriptions/debug**

This page will show you:
1. ✅ Current user info (ID and email)
2. ✅ ALL records in patientRecords collection
3. ✅ Records that match current user
4. ✅ Why records aren't showing

---

## 📊 What You'll See

### **Scenario A: No Records in Database**
```
All Patient Records in Database (0)
No records found in patientRecords collection
```

**Solution**: Doctor hasn't created any prescriptions yet
- Login as doctor
- Go to Patient Records
- Create first prescription

### **Scenario B: Records Exist But Don't Match**
```
All Patient Records in Database (3)
Record #1: patientId: xyz123 ❌ NO
Record #2: patientId: abc456 ❌ NO
Record #3: patientId: def789 ❌ NO

Records for Current User (0)
❌ No prescriptions found for this user
```

**Solution**: Doctor created prescription for wrong patient ID
- Note your current user ID from debug page
- Login as doctor
- Create prescription for THIS specific patient
- Make sure patientId matches

### **Scenario C: Records Match But Still Not Showing**
```
All Patient Records in Database (2)
Record #1: patientId: abc123 ✅ YES

Records for Current User (1)
✅ Prescription #1
```

**Solution**: Prescriptions page has a bug
- Check browser console (F12) for errors
- Look for detailed logs we just added
- Share the error messages

---

## 🔍 Browser Console Logs

When you go to prescriptions page, open console (F12) and look for:

### **Good Logs** (Working):
```
👤 Loading prescriptions for user: abc123
🔍 Querying patientRecords collection...
📡 Executing Firebase query...
✅ Query successful! Documents found: 2
📄 Processing document: docId123 {...}
📋 Loaded prescriptions: [Array(2)]
📊 Total prescriptions found: 2
```

### **Problem Logs** (Not Working):
```
❌ No user logged in
```
→ User not logged in properly

```
✅ Query successful! Documents found: 0
📭 No prescriptions found for this patient
💡 Tip: Make sure doctor created prescription for patientId: abc123
```
→ No prescriptions for this patient

```
❌ Error loading prescriptions: FirebaseError: ...
```
→ Firebase permission or query error

---

## 🧪 Complete Test Flow

### **1. Check Current State**
- Open: http://localhost:3001/patient/prescriptions/debug
- Note your user ID
- Check how many records exist
- Check if any match your user ID

### **2. Create Test Prescription**
- Login as doctor
- Go to Patient Records
- Click "Add Prescription"
- **Important**: Make sure the patient you select has ID matching the patient you want to test
- Fill prescription form
- Save

### **3. Verify in Debug Page**
- Refresh debug page
- Should see new record
- Should show ✅ YES for matching user
- Should appear in "Records for Current User" section

### **4. Check Prescriptions Page**
- Go to: http://localhost:3001/patient/prescriptions
- Open browser console (F12)
- Check logs
- Should see prescription

---

## 🔧 Common Issues & Solutions

### **Issue 1: Wrong Patient ID**

**Problem**: Doctor created prescription but used wrong patient ID

**Check**: 
- Debug page shows records but none match current user
- patientId in database ≠ current user ID

**Fix**:
```
1. Note correct patient ID from debug page
2. Login as doctor
3. Create NEW prescription
4. Make sure you select correct patient
5. Verify in debug page that patientId matches
```

### **Issue 2: User Profile Not Complete**

**Problem**: Patient or doctor profile incomplete

**Check**:
- User ID exists but profile might be missing

**Fix**:
```
1. Check Firebase Console → users collection
2. Verify user document exists
3. Check all required fields present
```

### **Issue 3: Firebase Rules**

**Problem**: Firestore security rules blocking read

**Check**:
```javascript
// In firestore.rules
match /patientRecords/{recordId} {
  allow read: if request.auth != null && 
              (resource.data.patientId == request.auth.uid || 
               resource.data.doctorId == request.auth.uid);
}
```

**Fix**: Update security rules if needed

---

## 📝 Debugging Checklist

When you open debug page, check these:

- [ ] User ID shows (not "Not logged in")
- [ ] User email shows
- [ ] "All Patient Records" shows count > 0
- [ ] At least one record shows ✅ YES for current user
- [ ] "Records for Current User" shows count > 0
- [ ] Record details look correct (doctor name, diagnosis, etc.)

If ALL checkboxes pass but still not showing:
→ Share screenshot of debug page + browser console logs

---

## 🚀 Quick Actions

### **Go to Debug Page**:
```
http://localhost:3001/patient/prescriptions/debug
```

### **Go to Prescriptions Page**:
```
http://localhost:3001/patient/prescriptions
```

### **Open Browser Console**:
- Windows: `F12` or `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

### **Check Firebase Data Directly**:
```
https://console.firebase.google.com/project/es-healthbridge/firestore/data/~2FpatientRecords
```

---

## 📸 What to Share for Help

If still not working, share:

1. **Screenshot of debug page** showing:
   - User info section
   - All records section
   - User records section

2. **Browser console logs** showing:
   - All the emoji logs (👤 🔍 📡 ✅ ❌)
   - Any error messages

3. **Firebase screenshot** showing:
   - One document from patientRecords collection
   - The patientId field value

---

## ✅ Success Criteria

Debug page should show:
```
Current User Info
User ID: abc123
Email: patient@test.com

All Patient Records in Database (1)
Record #1
Patient ID: abc123 ✅ YES

Records for Current User (1)
✅ Prescription #1
Doctor: Dr. Smith
Diagnosis: Hypertension
```

If you see this → Prescriptions page should work!

---

**Next Step**: Open debug page and share what you see! 🔍

**Debug URL**: http://localhost:3001/patient/prescriptions/debug
