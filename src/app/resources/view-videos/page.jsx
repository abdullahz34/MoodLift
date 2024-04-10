import VideoList from "@/components/VideoList"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const videos = async () => {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    return (
    <div className="flex justify-center">
        <VideoList />
    </div>
    )
}

export default videos;