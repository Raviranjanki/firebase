import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../lib/auth';
import { User } from '../../lib/models';
import { hash } from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      try {
        const { email, password, name } = req.body;
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
          res.status(400).json({ error: 'Email is already in use' });
          return;
        }
        const hashedPassword = await hash(password, 10);
        const user = await User.create({ email, name, password: hashedPassword });
        const token = await createAuthToken(user.id);
        res.status(201).json({ user, token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default withAuth(handler, { allowGuest: true });
