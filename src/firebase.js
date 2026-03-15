import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider,
         signInWithPopup, signInWithRedirect, getRedirectResult,
         signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc,
         collection, query, orderBy, limit,
         getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyABfmxXuZlzHIXuGx0cHKxAdctQ_ep-_sA",
  authDomain: "mayeshrecipes.firebaseapp.com",
  projectId: "mayeshrecipes",
  storageBucket: "mayeshrecipes.firebasestorage.app",
  messagingSenderId: "261954124",
  appId: "1:261954124:web:decb95f2d5b2b2e72cb2e9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

export const signInGoogle    = () => signInWithRedirect(auth, googleProvider);
export const signInMicrosoft = () => signInWithRedirect(auth, microsoftProvider);
export const getAuthRedirectResult = () => getRedirectResult(auth);
export const signInGuest     = () => signInAnonymously(auth);
export const doSignOut       = () => signOut(auth);

export const getUserDoc  = (uid) => getDoc(doc(db, 'users', uid));
export const saveUserDoc = (uid, data) => setDoc(doc(db, 'users', uid), data, { merge: true });

export const saveRecipe = (uid, recipeData) =>
  addDoc(collection(db, 'users', uid, 'recipes'), {
    ...recipeData, createdAt: serverTimestamp()
  });

export const saveRating = (uid, recipeTitle, rating) =>
  addDoc(collection(db, 'ratings'), {
    uid, recipeTitle, rating, createdAt: serverTimestamp()
  });

export const saveContactMessage = (data) =>
  addDoc(collection(db, 'contact'), {
    ...data, createdAt: serverTimestamp()
  });

export const getRecentRecipes = async (uid) => {
  const q = query(
    collection(db, 'users', uid, 'recipes'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
