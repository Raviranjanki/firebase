import { initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getConfig } from "./firebaseConfig";

interface RequestBody {
  email: string;
  password: string;
}

export class FirebaseAuth {
  static auth: Auth;
  static db: any;

  constructor() {
    const FIREBASE_CONFIG = getConfig();

    if (typeof window !== undefined) {
      initializeApp(FIREBASE_CONFIG);
      console.log("Firebase has been init successfully");
    }
    const firebaseApp = initializeApp(FIREBASE_CONFIG);
    FirebaseAuth.auth = getAuth(firebaseApp);
    FirebaseAuth.db = getFirestore(firebaseApp);
  }

  async signUp({ email, password }: RequestBody): Promise<string | null> {
    try {
      this.validateEmailAndPassword({ email, password });
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseAuth.auth,
        email,
        password
      );
      return userCredential.user.uid;
    } catch (error) {
      throw error;
    }
  }

  async signIn({ email, password }: RequestBody): Promise<User | null> {
    try {
      this.validateEmailAndPassword({ email, password });
      const userCredential = await signInWithEmailAndPassword(
        FirebaseAuth.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await FirebaseAuth.auth.signOut();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      FirebaseAuth.auth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("User is not authenticated"));
        }
      });
    });
  }

  validateEmailAndPassword({ email, password }: RequestBody) {
    if (!email || !password) {
      throw new Error("Please provide an email and password");
    }

    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(password);

    const passwordRegex: RegExp =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
      );
    }
  }
}
