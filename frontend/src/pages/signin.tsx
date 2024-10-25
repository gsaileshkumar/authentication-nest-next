import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      // Redirect to application page on successful sign-in
      router.push('/app');
    } catch {
      setError('An error occurred during sign-in. Please try again.');
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/signup'); // Redirect to the Sign-Up page
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full mt-4">
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p>{"Don't have an account?"}</p>
          <Button variant="link" onClick={handleSignUpRedirect} className="mt-2">
            Sign Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignIn;
