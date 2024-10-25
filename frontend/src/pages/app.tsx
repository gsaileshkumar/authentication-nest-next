import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import withAuth from '@/hoc/withAuth';

const SignOutButton: React.FC = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        // Redirect to the sign-in page after successful sign-out
        router.push('/signin');
      } else {
        console.error('Sign-out failed');
      }
    } catch (error) {
      console.error('An error occurred during sign-out:', error);
    }
  };

  return (
    <Button onClick={handleSignOut} className="mt-4">
      Sign Out
    </Button>
  );
};


function AppPage() {
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Welcome to the application</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">You are now logged in!</p>
        <SignOutButton />
      </CardContent>
    </Card>
  );
}

export default withAuth(AppPage);
