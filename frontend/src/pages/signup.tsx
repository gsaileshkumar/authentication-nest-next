import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false); // State to track success
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    const minLength = /.{8,}/;
    const hasLetter = /[a-zA-Z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      minLength.test(password) &&
      hasLetter.test(password) &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain a letter, a number, and a special character.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      // If sign-up is successful, show success message
      setSuccess(true);
      setError(null); // Clear any previous errors
    } catch {
      setError('An error occurred during sign-up. Please try again.');
    }
  };

  const handleSignInRedirect = () => {
    router.push('/signin'); // Redirect to the Sign-In page
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        {!success ? (
          // Show the sign-up form if not successful
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </form>
        ) : (
          // Show success message if sign-up is successful
          <div className="text-center">
            <p className="text-green-500 mb-4">Sign-up successful!</p>
            <Button variant="default" onClick={handleSignInRedirect}>
              Go to Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Signup;
