
import Link from "next/link"
import DeleteButton from "./DeleteButton"

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

  return (
    <div className="flex flex-col w-1/3">
        <>
        {videos.map((video) => (
            <div key={video._id} className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
            <div>
                <h2 className="font-bold text-2xl">{video.title}</h2>
                
                <iframe src={"//www.youtube.com/embed/"+getId(video.videoURL)}></iframe>

                <h2 className="font-bold">Description</h2>
                <p>{video.description}</p>

                <Link href={`./edit-video/${video._id}`}><button className="btn">Edit</button></Link>
                <DeleteButton id={video._id} route={"videos"} className="btn"/>
            </div>
            </div>
        ))}
        </>
    </div>
  );
}