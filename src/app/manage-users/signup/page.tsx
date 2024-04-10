import SignupForm from '@/components/SignupForm';
import BackButton from '@/components/backButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function Signup() {
  const session = await getServerSession(authOptions);

  if (session?.user?.type!=="Admin" && session?.user?.type!=="Superadmin") redirect("/dashboard");

  return (
    <main>
      <BackButton route="/manage-users" label="Manage users"/>
      <SignupForm />
    </main>
  )
}