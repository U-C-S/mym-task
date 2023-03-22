//boilerplate for nextjs page
import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => router.push('/login')}>Login</button>
    </div>
  );
};

export default Home;