import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { auth } from '../config/firebase';

// Test function to check if Firebase Storage is working
export const testFirebaseStorage = async () => {
  try {
    console.log('Testing Firebase Storage connection...');
    
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to test storage');
    }
    
    console.log('✅ User authenticated:', currentUser.uid);
    
    // Test 1: Create a test file
    const testContent = 'This is a test file for Firebase Storage';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;
    const testFilePath = `id-proofs/${currentUser.uid}/${testFileName}`;
    
    const storageRef = ref(storage, testFilePath);
    console.log('📁 Testing upload to:', testFilePath);
    
    // Test 2: Upload the test file
    const uploadResult = await uploadBytes(storageRef, testBlob);
    console.log('✅ File uploaded successfully:', uploadResult.ref.fullPath);
    
    // Test 3: Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Download URL obtained:', downloadURL);
    
    // Test 4: List files in the user's directory
    const userDirRef = ref(storage, `id-proofs/${currentUser.uid}`);
    const listResult = await listAll(userDirRef);
    console.log('✅ Files in user directory:', listResult.items.length);
    listResult.items.forEach(item => {
      console.log(`  - ${item.name}`);
    });
    
    // Test 5: Try to download the file we just uploaded
    const response = await fetch(downloadURL);
    const downloadedContent = await response.text();
    if (downloadedContent === testContent) {
      console.log('✅ File content verification successful');
    } else {
      throw new Error('File content mismatch');
    }
    
    // Test 6: Clean up - delete the test file
    await deleteObject(storageRef);
    console.log('✅ Test file deleted successfully');
    
    return {
      success: true,
      message: 'All Firebase Storage tests passed!',
      testFilePath: testFilePath,
      downloadURL: downloadURL,
      filesCount: listResult.items.length,
      userId: currentUser.uid
    };
    
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error);
    return {
      success: false,
      message: error.message,
      error: error,
      code: error.code,
      stack: error.stack
    };
  }
};

// Function to check storage permissions without uploading
export const checkStoragePermissions = async () => {
  try {
    console.log('Checking Firebase Storage permissions...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated',
        authenticated: false
      };
    }
    
    console.log('✅ User authenticated:', currentUser.uid);
    
    // Try to list files in user directory (this will test read permissions)
    const userDirRef = ref(storage, `id-proofs/${currentUser.uid}`);
    const listResult = await listAll(userDirRef);
    
    return {
      success: true,
      message: 'Storage permissions check passed',
      authenticated: true,
      userId: currentUser.uid,
      canRead: true,
      existingFiles: listResult.items.length,
      files: listResult.items.map(item => item.name)
    };
    
  } catch (error) {
    console.error('❌ Storage permissions check failed:', error);
    
    // Analyze the error to provide more specific feedback
    let errorType = 'unknown';
    if (error.code === 'storage/unauthorized') {
      errorType = 'permission_denied';
    } else if (error.code === 'storage/object_not_found') {
      errorType = 'directory_not_found';
    } else if (error.code === 'storage/canceled') {
      errorType = 'operation_canceled';
    }
    
    return {
      success: false,
      message: error.message,
      error: error,
      code: error.code,
      errorType: errorType,
      authenticated: !!auth.currentUser
    };
  }
};

// Function to test storage rules by attempting different operations
export const testStorageRules = async () => {
  try {
    console.log('Testing Firebase Storage rules...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to test storage rules');
    }
    
    const results = {
      userId: currentUser.uid,
      tests: []
    };
    
    // Test 1: Try to access another user's directory (should fail)
    try {
      const otherUserRef = ref(storage, `id-proofs/other-user-${Date.now()}/test.txt`);
      await listAll(otherUserRef);
      results.tests.push({
        test: 'access_other_user_directory',
        success: false,
        message: 'Should have failed but succeeded - security issue!'
      });
    } catch (error) {
      results.tests.push({
        test: 'access_other_user_directory',
        success: true,
        message: 'Correctly denied access to other user directory',
        error: error.message
      });
    }
    
    // Test 2: Try to access root directory (should fail)
    try {
      const rootRef = ref(storage, '');
      await listAll(rootRef);
      results.tests.push({
        test: 'access_root_directory',
        success: false,
        message: 'Should have failed but succeeded - security issue!'
      });
    } catch (error) {
      results.tests.push({
        test: 'access_root_directory',
        success: true,
        message: 'Correctly denied access to root directory',
        error: error.message
      });
    }
    
    // Test 3: Try to access user's own directory (should succeed)
    try {
      const userDirRef = ref(storage, `id-proofs/${currentUser.uid}`);
      await listAll(userDirRef);
      results.tests.push({
        test: 'access_own_directory',
        success: true,
        message: 'Successfully accessed own directory'
      });
    } catch (error) {
      results.tests.push({
        test: 'access_own_directory',
        success: false,
        message: 'Failed to access own directory',
        error: error.message
      });
    }
    
    return {
      success: true,
      message: 'Storage rules test completed',
      results: results
    };
    
  } catch (error) {
    console.error('❌ Storage rules test failed:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};
