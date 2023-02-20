import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirebaseAuth } from "./firebase";

interface UserData {
  email: string;
  password: string;
}

export class User extends FirebaseAuth {
  password: string;
  email: string;

  constructor({ email, password }: UserData) {
    super();
    this.email = email;
    this.password = password;
  }

  async save(): Promise<User | null> {
    try {
      const now = Timestamp.now();
      const userData: UserData = {
        email: this.email,
        password: this.password,
      };

      const uid = await this.signUp({
        email: this.email,
        password: this.password,
      });

      if (uid) {
        const docRef = await setDoc(
          doc(FirebaseAuth.db, "users", uid),
          userData
        );
        console.log(docRef);
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(FirebaseAuth.db, "users", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("No such document!");
      }
      const userData = docSnap.data() as UserData;

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(FirebaseAuth.db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(data: UserData): Promise<void> {
    try {
      this.email = data?.email;

      const washingtonRef = doc(
        FirebaseAuth.db,
        "users",
        "QwaqlZFF5TbiqKdQ7Kcd"
      );

      await updateDoc(washingtonRef, {
        email: data?.email,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
