// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBjl97owGG4yzs1IyYr_Nrb2lEqySRqXuk',
  authDomain: 'pseudo2code-plus.firebaseapp.com',
  projectId: 'pseudo2code-plus',
  storageBucket: 'pseudo2code-plus.firebasestorage.app',
  messagingSenderId: '198261662476',
  appId: '1:198261662476:web:c86646a4926f0f9b981f29',
  measurementId: 'G-W8TYE4FZVV',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
