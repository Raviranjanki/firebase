import { useState } from 'react';

interface FormErrors<T> {
  [K in keyof T]?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginError extends FormErrors<LoginData> {}

type FormState<T> = {
  [K in keyof T]: string;
};

type FormError<T> = {
  [K in keyof T]?: string;
};

type FormProps<T> = {
  initialValues: FormState<T>;
  onSubmit: (data: FormState<T>) => Promise<void>;
  validate: (data: FormState<T>) => FormError<T>;
};

function Form<T>({ initialValues, onSubmit, validate }: FormProps<T>) {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState<FormError<T>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const getErrorForField = (field: keyof T): string | undefined => {
    return formErrors[field];
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key}
            <input type="text" name={key} value={formData[key]} onChange={handleInputChange} />
          </label>
          {getErrorForField(key as keyof T) && <div>{getErrorForField(key as keyof T)}</div>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

function validateFormData<T>(data: FormState<T>, validationRules: FormError<T>): FormError<T> {
  const errors: FormError<T> = {};
  for (const key in validationRules) {
    const rule = validationRules[key];
    const value = data[key];
    if (rule.required && !value) {
      errors[key] = `${key} is required`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[key] = `Invalid ${key}`;
    }
  }
  return errors;
}

function Login() {
  const [loginError, setLoginError] = useState<LoginError>({});

  const handleLogin = async (data: LoginData) => {
    // Handle login
  };

  const validate = (data: FormState<LoginData>): LoginError => {
    const validationRules: FormError<LoginData> = {
      email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
      password: { required: true }
    };
    return validateFormData(data, validationRules);
  };

  return <Form initialValues={{ email: '', password: '' }} onSubmit={handleLogin} validate={validate} />;
}


//////////////////////////////////////////////////////////////////



import { useState } from 'react';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

function Signup() {
  const [signupError, setSignupError] = useState<FormError<SignupData>>({});

  const handleSignup = async (data: FormState<SignupData>) => {
    // Handle signup
  };

  const validationRules: FormError<SignupData> = {
    name: { required: true },
    email: { required: true, pattern: /^\S+@\S+\.\S+$/ },
    password: { required: true }
  };

  return <Form<SignupData> initialValues={{ name: '', email: '', password: '' }} onSubmit={handleSignup} validationRules={validationRules} />;
}
