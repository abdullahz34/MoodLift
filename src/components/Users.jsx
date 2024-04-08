import { useSession } from 'next-auth/react';
import DeleteUser from './DeleteUser';

export default function Users({users}) {
  const { data: session } = useSession();

  return (
    <>
      <ul className="grid grid-cols-4 mx-auto max-w-[1260px] gap-10">
        {users.map(user => (
          !(session?.user?.type==='Admin' && (user.type==='Superadmin' || user.type==='Admin')) &&
          <div key={user._id} className="card w-40 bg-neutral-content p-1">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-sm">{user.username}</h3>
              <p className="text-xs">{user.name}</p>
              <p className="text-xs">{user.type}</p>
              <div className="card-actions">
                <DeleteUser id={user._id}/>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </>
  )
}