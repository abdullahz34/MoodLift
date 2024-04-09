import ModifySearch from "@/components/ModifySearch";
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export default async function Modify() {
  const session = await getServerSession(authOptions);
  if (session?.user?.type!=="Admin" && session?.user?.type!=="Superadmin") redirect("/");

  return (
    <main>
      <ModifySearch />
    </main>
  )
}