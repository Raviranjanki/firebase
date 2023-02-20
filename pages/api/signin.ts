import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { convertToApiResponse, ApiResponse } from '../../utils/api/convertToApiResponse'
import { FirebaseAuth } from '../../lib/firebase';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseBody {
  id: string;
  email: string;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LoginResponseBody | null>>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body as LoginRequestBody;

    try {
      // authenticate user with email and password
      const auth = new FirebaseAuth()
      const user = await auth.signIn({ email, password })

      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

      // set authentication token to cookie
      const token = await userCredential.user.getIdToken();
      res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Secure`);

      // get user data from Firestore
      const userDoc = await firebase.firestore().collection('users').doc(userCredential.user.uid).get();
      const userData = userDoc.data();

      // convert user data to API response format
      const responseData: LoginResponseBody = {
        id: userCredential.user.uid,
        email: userData.email,
        name: userData.name
      };
      const response: ApiResponse<LoginResponseBody> = convertToApiResponse(responseData);

      res.status(200).json(response);
    } catch (error) {
      console.error('Error logging in user:', error);
      const response: ApiResponse<LoginResponseBody | null> = convertToApiResponse(null, error.message);
      res.status(401).json(response);
    }
  } else {
    const response: ApiResponse<LoginResponseBody | null> = convertToApiResponse(null, 'Invalid request method');
    res.status(405).json(response);
  }
}
