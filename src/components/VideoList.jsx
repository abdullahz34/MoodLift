import Link from "next/link"
import DeleteButton from "./DeleteButton"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getVideos = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/videos", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch videos");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading videos: ", error);
  }
};

function getId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
      return match[2];
  } else {
      return 'error';
  }
}

export default async function VideoList() {
  const { videos } = await getVideos();
  videos.map((video) => (
    console.log(getId(video.videoURL))
  ))

  const session = await getServerSession(authOptions);

  if (session && (session.user.type === 'Admin' || session.user.type === 'Ambassador')) {
  return (
    <div className="flex flex-col w-1/3">
      {videos.map((video) => (
        <div key={video._id} className="p-4 border border-slate-300 my-3 relative">
          <h2 className="font-bold text-2xl">{video.title}</h2>
          
          <div className="w-full">
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={"//www.youtube.com/embed/" + getId(video.videoURL)}
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div className="overflow-hidden">
            <h2 className="font-bold">Description</h2>
            <p className="whitespace-pre-line">{video.description}</p>
          </div>

          <div className="flex gap-3">
            <Link href={`./edit-video/${video._id}`}>
              <button className="btn">Edit</button>
            </Link>
            <DeleteButton id={video._id} route={"videos"} className="btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

else{
  return (
    <div className="flex flex-col w-1/3">
      {videos.map((video) => (
        <div key={video._id} className="p-4 border border-slate-300 my-3 relative">
          <h2 className="font-bold text-2xl">{video.title}</h2>
          
          <div className="w-full">
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={"//www.youtube.com/embed/" + getId(video.videoURL)}
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div className="overflow-hidden">
            <h2 className="font-bold">Description</h2>
            <p className="whitespace-pre-line">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
}