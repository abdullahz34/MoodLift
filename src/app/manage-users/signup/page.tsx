import SignupForm from '@/components/SignupForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function Signup() {
  const session = await getServerSession(authOptions);

  if (session?.user?.type!=="Admin") redirect("/dashboard");

  return (
    <main>
      <SignupForm />
    </main>
  )
}