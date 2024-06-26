import Link from "next/link"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getArticles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/articles", {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }
  
      return res.json();
    } catch (error) {
      console.log("Error loading articles: ", error);
    }
  };

const articles = async () => {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
  

    const {articles} = await getArticles();

    return (
    <div className="flex flex-wrap justify-center gap-4">
        {articles.map((post) =>(
            <Link href={"view-articles/" + post._id}>
                <div className="card card-compact w-96 h-80 bg-base-100 shadow-xl">
                  <figure><img src={post.imgURL} alt={post.title} /></figure>
                    <div className="card-body">
                        <h2 className="card-title">{post.title}</h2>
                        <p>{post.summary}</p>
                    </div>
                </div>
                
            </Link>

        ))}
      </div>
    )
}

export default articles;