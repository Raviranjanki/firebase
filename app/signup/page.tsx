import { useState } from 'react';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupError {
  field: keyof SignupData;
  message: string;
}

export default function Signup() {
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signupErrors, setSignupErrors] = useState<SignupError[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateSignupData(signupData);
    if (errors.length > 0) {
      setSignupErrors(errors);
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      if (response.ok) {
        // Handle successful signup
      } else {
        const data = await response.json();
        setSignupErrors([{ field: 'email', message: data.error }]);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setSignupErrors([{ field: 'email', message: 'An unknown error occurred' }]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const validateSignupData = (data: SignupData): SignupError[] => {
    const errors: SignupError[] = [];
    if (!data.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    }
    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (data.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }
    if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    return errors;
  };

  const getErrorForField = (field: keyof SignupData): string | undefined => {
    const error = signupErrors.find((error) => error.field === field);
    return error?.message;
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" value={signupData.email} onChange={handleInputChange} />
        <div>{getErrorForField('email')}</div>
      </label>
      <label>
        Password
        <input type="password" name="password" value={signupData.password} onChange={handleInputChange} />
        <div>{getErrorForField('password')}</div>
      </label>
      <label>
        Confirm Password
        <input type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleInputChange} />
        <div>{getErrorForField('confirmPassword')}</div>
      </label>
      <button type="submit">Signup</button>
    </form>
  );
}
