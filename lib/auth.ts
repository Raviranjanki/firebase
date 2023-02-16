// lib/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../lib/firebase";
import { User } from "./models";

import firebase from "firebase/app";
import "firebase/auth";

export default class Auth {
  static async signInWithEmailAndPassword(email: string, password: string) {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userCredential.user;
  }

  static async createUserWithEmailAndPassword(email: string, password: string) {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  }

  static async signOut() {
    return firebase.auth().signOut();
  }

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }
}

export async function verifyIdToken(
  idToken: string
): Promise<firebaseAdmin.auth.DecodedIdToken> {
  const result = await firebaseAdmin.auth().verifyIdToken(idToken);
  return result;
}

export async function getUserFromIdToken(
  idToken: string
): Promise<User | null> {
  try {
    const decodedIdToken = await verifyIdToken(idToken);
    const uid = decodedIdToken.uid;
    const user = await User.getById(uid);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const idToken = req.headers.authorization?.replace("Bearer ", "");
    if (!idToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const user = await getUserFromIdToken(idToken);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.user = user;
    return handler(req, res);
  };
}
