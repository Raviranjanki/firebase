import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../lib/auth';
import { User } from '../../lib/models';
import { compare } from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      try {
        const { email, password } = req.body;
        const user = await User.getByEmail(email);
        if (!user) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
        const token = await createAuthToken(user.id);
        res.status(200).json({ token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default withAuth(handler, { allowGuest: true });



/////////////////////////////////////////////////////////////////

async function fetchWithGetParams(url: string, params: Record<string, string> = {}): Promise<any> {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => queryParams.append(key, params[key]));

  const response = await fetch(`${url}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error.message);
  }
}

async function getUserData(userId: string): Promise<any> {
  const url = `/api/users/${userId}`;
  const params = { format: 'json' };
  try {
    const response = await fetchWithGetParams(url, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

