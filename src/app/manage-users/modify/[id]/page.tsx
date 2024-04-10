import BackButton from '@/components/backButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditUser from "../../../../components/EditUser";

const getUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/searchUser/edit/${id}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function Edit({params}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.type!=="Admin" && session?.user?.type!=="Superadmin") redirect("/");

  const { id } = params;
  const { user } = await getUser(id);
  const { username, name, type } = user;

  return (
    <main>
      <BackButton route="/manage-users/modify" label="Search users"/>
      <EditUser id={id} username={username} name={name} type={type}/>
    </main>
  )
}