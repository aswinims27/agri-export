# Firebase Storage Debug Guide

This guide will help you debug Firebase Storage issues in your AgriExport application.

## Overview

I've created comprehensive debugging tools to help identify and resolve Firebase Storage problems:

### Files Created:
1. `src/utils/testStorage.js` - Storage testing utilities
2. `src/pages/TestStorage.jsx` - Storage debug interface
3. Updated `src/App.tsx` - Added routing for TestStorage page
4. Updated `src/components/Navbar.jsx` - Added navigation links

## Current Firebase Storage Configuration

### Firebase Config (`src/config/firebase.js`)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBE6L-BnsFgOmZzeMvPrf24rXWflNF-bqk",
  authDomain: "farmer-export.firebaseapp.com",
  projectId: "farmer-export",
  storageBucket: "farmer-export.firebasestorage.app",
  messagingSenderId: "73225893814",
  appId: "1:73225893814:web:2fc06779c246ba29edb317",
  measurementId: "G-9JTYZ37YGY"
};
```

### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ID proofs can only be uploaded and read by the owner
    match /id-proofs/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Use the Debug Tools

### 1. Access the Debug Interface
- Log in to the application
- Navigate to `/test-storage` or click "Test Storage" in the navbar
- The debug interface provides comprehensive testing options

### 2. Debug Interface Features

#### Authentication Status
- Shows current user authentication state
- Displays user ID and email if authenticated

#### Test Controls
- **Check Permissions**: Verifies basic storage access rights
- **Run Full Storage Test**: Tests upload, download, and deletion
- **Test Storage Rules**: Validates security rules
- **Clear Results**: Resets all test results

#### Test Results Display
- Color-coded success/failure indicators
- Detailed error messages with codes
- Step-by-step test breakdown

### 3. Testing Scenarios

#### Scenario 1: Permission Issues
**Symptoms**: "permission-denied" errors, "unauthorized" access
**Solution**: 
1. Run "Check Permissions"
2. Verify user is authenticated
3. Check storage rules in Firebase Console

#### Scenario 2: Upload/Download Issues
**Symptoms**: Files not uploading, download URLs not working
**Solution**:
1. Run "Full Storage Test"
2. Check network connectivity
3. Verify file paths and formats

#### Scenario 3: Security Rule Issues
**Symptoms**: Unexpected access denials or grants
**Solution**:
1. Run "Test Storage Rules"
2. Review storage rules configuration
3. Test different user scenarios

## Common Issues and Solutions

### 1. User Not Authenticated
**Error**: "User must be authenticated to test storage"
**Solution**: 
- Log in before testing storage
- Check Firebase authentication configuration

### 2. Storage Rules Too Restrictive
**Error**: "storage/unauthorized" when accessing own directory
**Solution**:
- Verify storage rules allow access to `id-proofs/{userId}/**`
- Ensure user ID matches the path
- Check Firebase Console for rule deployment

### 3. Incorrect File Paths
**Error**: "storage/object-not-found" or "storage/invalid-path"
**Solution**:
- Use correct path format: `id-proofs/{userId}/filename`
- Verify user ID is correctly obtained
- Check for special characters in filenames

### 4. Network Issues
**Error**: Timeout or connection errors
**Solution**:
- Check internet connection
- Verify Firebase project configuration
- Test with different file sizes

### 5. CORS Issues
**Error**: Browser CORS errors when accessing download URLs
**Solution**:
- Configure CORS in Firebase Storage settings
- Ensure proper headers are set
- Test download URLs in different browsers

## Advanced Debugging

### Console Logging
The debug tools provide detailed console logging:
```javascript
console.log('Testing Firebase Storage connection...');
console.log('✅ File uploaded successfully:', uploadResult.ref.fullPath);
console.log('❌ Firebase Storage test failed:', error);
```

### Error Code Reference
Common Firebase Storage error codes:
- `storage/unauthorized`: User lacks permission
- `storage/object-not-found`: File doesn't exist
- `storage/canceled`: Operation was canceled
- `storage/invalid-argument`: Invalid parameters provided
- `storage/unknown`: Unknown error occurred

### Firebase Console Debugging
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: "farmer-export"
3. Navigate to Storage section
4. Check:
   - Storage bucket configuration
   - Security rules
   - File browser
   - Usage and analytics

## Testing Checklist

Before deploying to production, verify:

- [ ] User authentication works properly
- [ ] Storage rules are correctly configured
- [ ] Upload functionality works for valid files
- [ ] Download URLs are accessible
- [ ] File deletion works as expected
- [ ] Error handling is comprehensive
- [ ] Console logging provides useful information
- [ ] UI shows clear status indicators

## Next Steps

1. **Run the Tests**: Use the debug interface to identify specific issues
2. **Review Configuration**: Check Firebase Console settings
3. **Test Edge Cases**: Try different file sizes, types, and user scenarios
4. **Monitor Logs**: Check browser console and Firebase logs
5. **Fix Issues**: Address problems identified by the debug tools

## Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify Firebase project configuration
3. Review storage rules in Firebase Console
4. Test with different users and file types
5. Consult Firebase Storage documentation

The debug tools provide comprehensive testing capabilities to help you identify and resolve Firebase Storage issues quickly and effectively.
