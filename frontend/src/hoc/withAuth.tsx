import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check`, {
            method: 'GET',
            credentials: 'include', // Include cookies for auth check
          });

          // If the user is not authenticated, redirect to the sign-in page
          if (!response.ok) {
            router.push('/signin');
          }
        } catch {
          router.push('/signin');
        }
      };

      checkAuth();
    }, [router]);

    // Render the component if authenticated, otherwise wait for redirection
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
