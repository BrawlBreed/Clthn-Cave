import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  where
} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'AIzaSyDDU4V-_QV3M8GyhC9SVieRTDM4dbiT0Yk',
//   authDomain: 'crwn-clothing-db-98d4d.firebaseapp.com',
//   projectId: 'crwn-clothing-db-98d4d',
//   storageBucket: 'crwn-clothing-db-98d4d.appspot.com',
//   messagingSenderId: '626766232035',
//   appId: '1:626766232035:web:506621582dab103a4d08d6',
// };

const firebaseConfig = {
  apiKey: "AIzaSyBXls94WXILbEobFYaiJ6SpZDZGOI7M_3k",
  authDomain: "clothin-cave.firebaseapp.com",
  projectId: "clothin-cave",
  storageBucket: "clothin-cave.appspot.com",
  messagingSenderId: "108559415787",
  appId: "1:108559415787:web:c9be9301d8961800ccc1ae",
  measurementId: "G-J512G06HFD"
};
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore(firebaseApp);

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  field
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    
    return {...acc, [title]: items};
  }, {});
  
  return categoryMap;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const conditionDataQuery = async (col, field, operator, fieldValue) => {
  const result = {msg:'', success:'No'};

  const colRef = collection(db, col)
  try{
    const q = query(colRef, where(field, operator, [fieldValue])); 
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => (
      {...doc.data()}
    ))
      // return data.docs.map((doc) => ({...doc.data(), id:doc.id}))
  }
  catch(e){
    console.log(e)
  } 
} 

export const signIn = async (userData) => {
  try{
    const userRef = await signInWithEmailAndPassword(auth, userData.displayNameEmail, userData.password)
    return {userRef, success: 'Yes'};
  }
  catch(err){
    const error = await err.code;
    return {error, success: 'No'};
  }
}
export const addUser = async (userData) => {
  const result = {msg:'', success:'No'};
  try{
    const userRef = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const Doc = doc(db, 'admins', userRef.user.uid);
    const data = {
      displayName: userData.displayName,
      email: userData.email,
      createdAt: userData.createdAt,
    }

    const docRef = await setDoc(Doc, data)
    console.log(docRef)
    const msg = "User created successfully!"
    result.msg = msg;
    result.success = 'Yes';
    return result
  }catch(err){
    const msg = await err.code;
    result.msg = msg;
    return result; 
  }
}

export const setNewPassword = async (auth, obbCode, newPassword) => {
  try{
    const response = await confirmPasswordReset(auth, obbCode, newPassword)
    console.log(response)

    return true
  }catch(err){
    console.log(err)
    return false
  }
    
}

export const sendConfirmationEmail = async (email) => {
  // const actionCodeSettings = {
  //   url: code, // URL of the page where the user will enter the confirmation code
  //   handleCodeInApp: true, // Open the link in the app instead of in a web browser
  // };

  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}
  
export const verifyEmailCode = async (obbCode) => {

  try{
    const response = await verifyPasswordResetCode(auth, obbCode)
    return true
  }catch(err){
    console.log(err)
    return false
  }

}