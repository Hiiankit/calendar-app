
'use client'


import {getApp,getApps,initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyDcEZaD74Y3dLcXzgDamPlpML3u8u4X38E",
  authDomain: "calendar-a59ad.firebaseapp.com",
  projectId: "calendar-a59ad",
  storageBucket: "calendar-a59ad.appspot.com",
  messagingSenderId: "325023964567",
  appId: "1:325023964567:web:3cadcb13152136c907f8d2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(); 

export {app,auth}