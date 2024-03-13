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
  confirmPasswordReset,
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
  where,
  setDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {   
  getStorage, 
  ref,
  uploadBytesResumable,
  getDownloadURL 
} from 'firebase/storage'

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
export const updateProducts = async (categoryId, products) => {
  try{
    const docRef = doc(db, `categories/`, categoryId)
    await getDoc(docRef)
    .then((data) => data.data())
    .then((obj) => setDoc(docRef, {...obj, items: products}))    

    return true
  }catch(err){
    console.log(err)

    return  false
  }
}
export const updateCategory = async (categoryId, categoryData) => {
  const { title, imageUrl } = categoryData
  try{
    const docRef = doc(db, `categories/`, categoryId)
    const newDocRef = doc(db, `categories/`, categoryData.title)
    const exists = await getDoc(newDocRef)
    .then((data) => {
      if(data.exists()){
        return data.data()
      }else{
        return data.data()
      }
    })

    if(exists){
      await setDoc(newDocRef, {...exists, imageUrl: imageUrl, title: title})
    }else{
      await getDoc(docRef)
      .then((data) => data.data())
      .then((obj) => setDoc(newDocRef, {...obj, imageUrl: imageUrl, title: title}))
      .then(() => deleteDoc(docRef))
    }
    return true
  }catch(err){
    console.log(err)

    return false
  }
}
export const addCategoryDocument = async (col, title, docData = 0) => {
  const { categoryImage } = docData;
  try{
    const categoryRef = doc(db, 'categories', col)
    const categorySnapshot = getDoc(categoryRef)
    const exists = (await categorySnapshot).exists()

    if(exists){
      const docRef = doc(db, `categories/${col}`)
      try{
        await getDoc(docRef)
        .then((data) => data.data())
        .then((obj) => setDoc(docRef, {...obj, items:[...obj.items, docData]}))
         
        return true
      }catch(err){
        console.log(err)

        return true
      }
    }else{
      try{
        const colRef = doc(db, 'categories', col)
        const data = {
          title: col,
          imageUrl: categoryImage,
          items: [
            docData
          ]
        }
        await setDoc(colRef, data)

        return true
      }catch(err){
        console.log(err)

        return false
      }
    }
  
  }catch(error){
    console.log(`Error: ${error}`)

    return false
  }

}
export const deleteCategories = async (categoryId) => {
    try{
      const categoryRef = doc(db, `categories/${categoryId}`)
      await deleteDoc(categoryRef)

      return true
    }catch(err){
      console.log(err)

      return false
    }
}
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

export const handleUpload = async (images) => {
  const storage = getStorage()
  const metadata = {
    contentType: 'image/jpeg'
  };  
  const urls = []
  console.log(images)

  Object.values(images).forEach((image) => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata)
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          urls.push(downloadURL)
        });
      }
    );
      
  });

  return urls
}
export const placeOrder = async (orderData) => {
  const { name, phone, country } = orderData
  try{
    const docRef = doc(db, 'orders', name)
    await setDoc(docRef, {...orderData, from: new Date(), phone: `+${country}${phone}` })

    return true
  }catch(err){
    console.log(err)

    return false
  }

}
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = await Promise.all(querySnapshot.docs.map(async (item) => {
    const categoryRef = doc(db, `categories`, item.id)
    const category = await getDoc(categoryRef)
    const data = category.data()
    const { title, imageUrl, items } = data

    return {category: {title: title, imageUrl: imageUrl }, products: items }
  }))

  return categoryMap;
};


export const getOrders = async () => {
  const ordersRef = collection(db, 'orders')
  const q = query(ordersRef);

  try{
    const querySnapshot = await getDocs(q)
    const categoryMap = await Promise.all(querySnapshot.docs.map(async (item) => {
      const categoryRef = doc(db, `orders`, item.id)
      const category = await getDoc(categoryRef)
      const data = category.data()

      return data
    }))
    return categoryMap 
  }catch(err){
    console.log(err)

    return false
  }
}

export const deleteOrder = async (orderId) => {
  try{
    const orderRef = doc(db, `orders`, orderId)
    await deleteDoc(orderRef)

    return true
  }catch(err){
    console.log(err)

    return false
  }
}