import { firestore } from "../lib/firebase";

interface UserData {
  name: string;
  email: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export class User {
  id: string;
  name: string;
  email: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;

  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: firebase.firestore.Timestamp,
    updatedAt: firebase.firestore.Timestamp
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(name: string, email: string): Promise<User> {
    const newUserRef = firestore.collection("users").doc();
    const now = firebase.firestore.Timestamp.now();
    const userData: UserData = {
      name,
      email,
      createdAt: now,
      updatedAt: now,
    };
    await newUserRef.set(userData);
    return new User(
      newUserRef.id,
      userData.name,
      userData.email,
      userData.createdAt,
      userData.updatedAt
    );
  }

  static async getById(id: string): Promise<User | null> {
    const userRef = firestore.collection("users").doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return null;
    }
    const userData = userDoc.data() as UserData;
    return new User(
      userDoc.id,
      userData.name,
      userData.email,
      userData.createdAt,
      userData.updatedAt
    );
  }

  static async getByEmail(email: string): Promise<User | null> {
    const querySnapshot = await firestore
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as UserData;
    return new User(
      userDoc.id,
      userData.name,
      userData.email,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async update(data: UserData): Promise<void> {
    this.name = data.name;
    this.email = data.email;
    this.updatedAt = firebase.firestore.Timestamp.now();
    const userRef = firestore.collection("users").doc(this.id);
    await userRef.update({
      name: data.name,
      email: data.email,
      updatedAt: this.updatedAt,
    });
  }
  
  private validate(data: any) {
    const { name, email, password } = data;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email address");
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      throw new Error("Invalid password: must be at least 6 characters long");
    }

    return {
      name: name?.trim(),
      email: email.trim(),
      password: password.trim(),
    };
  }

  async delete(): Promise<void> {
    const userRef = firestore.collection("users").doc(this.id);
    await userRef.delete();
  }
}
