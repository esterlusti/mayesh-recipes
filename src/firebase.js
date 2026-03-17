import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider,
         signInWithPopup, signInWithRedirect, getRedirectResult,
         linkWithPopup,
         signInAnonymously, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc,
         collection, collectionGroup, query, orderBy, limit,
         getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

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

// If user is anonymous, try to link the account to keep their data.
// If linking fails (e.g. account already exists), fall back to regular sign-in.
const signInOrLink = async (provider) => {
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.isAnonymous) {
    try {
      return await linkWithPopup(currentUser, provider);
    } catch (e) {
      // auth/credential-already-in-use — account exists, sign in normally
      if (e.code === 'auth/credential-already-in-use' || e.code === 'auth/email-already-in-use') {
        return await signInWithPopup(auth, provider);
      }
      throw e;
    }
  }
  return await signInWithPopup(auth, provider);
};

export const signInGoogle    = () => signInOrLink(googleProvider);
export const signInMicrosoft = () => signInOrLink(microsoftProvider);
export const getAuthRedirectResult = () => getRedirectResult(auth);
export const signInGuest     = () => signInAnonymously(auth);
export const doSignOut       = () => signOut(auth);

export const getUserDoc  = (uid) => getDoc(doc(db, 'users', uid));
export const saveUserDoc = (uid, data) => setDoc(doc(db, 'users', uid), data, { merge: true });

export const saveRecipe = (uid, recipeData) =>
  addDoc(collection(db, 'users', uid, 'recipes'), {
    ...recipeData, createdAt: serverTimestamp()
  });

export const deleteRecipe = (uid, recipeId) =>
  deleteDoc(doc(db, 'users', uid, 'recipes', recipeId));

export const saveRating = (uid, recipeTitle, rating) =>
  addDoc(collection(db, 'ratings'), {
    uid, recipeTitle, rating, createdAt: serverTimestamp()
  });

export const saveContactMessage = (data) =>
  addDoc(collection(db, 'contact'), {
    ...data, createdAt: serverTimestamp()
  });

// ── Admin helpers ──

export const logRecipeQuery = (uid, displayName, payload) =>
  addDoc(collection(db, 'queryLogs'), {
    uid, displayName, requestPayload: payload, createdAt: serverTimestamp()
  });

export const getAllRecentRecipes = async (limitCount = 50) => {
  const q = query(
    collectionGroup(db, 'recipes'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    uid: d.ref.parent.parent?.id || '',
    ...d.data()
  }));
};

export const getRecentQueryLogs = async (limitCount = 50) => {
  const q = query(
    collection(db, 'queryLogs'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteRecipeDoc = (uid, recipeId) =>
  deleteDoc(doc(db, 'users', uid, 'recipes', recipeId));

export const getAllUsers = async (limitCount = 100) => {
  const q = query(collection(db, 'users'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── AI Settings ──

export const updateAIModel = (model, uid) =>
  setDoc(doc(db, 'settings', 'ai'), {
    activeModel: model,
    updatedAt: serverTimestamp(),
    updatedBy: uid
  }, { merge: true });

export const onAISettingsChange = (callback) =>
  onSnapshot(doc(db, 'settings', 'ai'), (snap) => {
    callback(snap.exists() ? snap.data() : { activeModel: 'openai' });
  });

// ── About page content ──

export const getAboutContent = async () => {
  const snap = await getDoc(doc(db, 'settings', 'about'));
  return snap.exists() ? snap.data() : null;
};

export const saveAboutContent = (content, uid) =>
  setDoc(doc(db, 'settings', 'about'), {
    content,
    updatedAt: serverTimestamp(),
    updatedBy: uid
  }, { merge: true });

// ── Default pantry staples (admin) ──

export const getDefaultPantryStaples = async () => {
  const snap = await getDoc(doc(db, 'settings', 'defaults'));
  return snap.exists() ? (snap.data().pantryStaples || []) : [];
};

export const saveDefaultPantryStaples = (staples, uid) =>
  setDoc(doc(db, 'settings', 'defaults'), {
    pantryStaples: staples,
    updatedAt: serverTimestamp(),
    updatedBy: uid
  }, { merge: true });

export const getRecentRecipes = async (uid) => {
  const q = query(
    collection(db, 'users', uid, 'recipes'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
