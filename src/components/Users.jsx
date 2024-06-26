import { useSession } from 'next-auth/react';
import DeleteUser from './DeleteUser';
import { useRouter } from "next/navigation";

export default function Users({users, setSubmitted}) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <ul className="grid grid-cols-4 mx-auto max-w-[1260px] gap-10">
        {users.map(user => (
          !((session?.user?.type==='Admin' && user.type==='Admin') || user.type==='Superadmin') &&
          <div key={user._id} className="card w-56 bg-neutral-content p-1">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-sm">{user.username}</h3>
              <p className="text-xs">{user.name}</p>
              <p className="text-xs">{user.type}</p>
              <div className="card-actions">
                <DeleteUser id={user._id} setSubmitted={setSubmitted}/>
                <button className="btn btn-sm btn-square btn-outline" onClick={() => router.push(`/manage-users/modify/${user._id}`)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </>
  )
}