import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { currentViewer } from '@/lib/auth/viewer';
import LoginPage from './login/page';

export const metadata: Metadata = {
  title: 'wishin.app',
  description: 'A wishlist app for friends and family',
};

const Home = async () => {
  if (await currentViewer()) {
    redirect('/home');
  }
  return <LoginPage />;
};

export default Home;
