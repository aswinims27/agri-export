import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  addDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';

// Community Forum Service
export const communityService = {
  // Create new post
  createPost: async (postData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'communityPosts'), {
        ...postData,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        authorEmail: user.email,
        likes: [],
        likesCount: 0,
        comments: [],
        commentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get all posts
  getAllPosts: async (limit = 20) => {
    try {
      const q = query(
        collection(db, 'communityPosts'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  // Get posts by category
  getPostsByCategory: async (category) => {
    try {
      const q = query(
        collection(db, 'communityPosts'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting posts by category:', error);
      throw error;
    }
  },

  // Like/Unlike post
  toggleLike: async (postId, isLiked) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const postRef = doc(db, 'communityPosts', postId);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
          likesCount: increment(1)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
          likesCount: increment(-1)
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Add comment to post
  addComment: async (postId, commentText) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const comment = {
        id: Date.now().toString(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous Farmer',
        content: commentText,
        createdAt: serverTimestamp()
      };

      const postRef = doc(db, 'communityPosts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
        commentsCount: increment(1)
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Listen to posts changes
  listenToPosts: (callback, filters = {}) => {
    try {
      let q = collection(db, 'communityPosts');
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(posts);
      });
    } catch (error) {
      console.error('Error listening to posts:', error);
      throw error;
    }
  },

  // Delete post (only by author)
  deletePost: async (postId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const postDoc = await getDoc(doc(db, 'communityPosts', postId));
      if (postDoc.exists() && postDoc.data().authorId === user.uid) {
        await deleteDoc(doc(db, 'communityPosts', postId));
      } else {
        throw new Error('Unauthorized to delete this post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};