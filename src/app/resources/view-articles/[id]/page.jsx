import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import styles from "./singleArticle.module.css";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

const getData = async (id) => {
    const res = await fetch(`http://localhost:3000/api/articles/${id}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      throw new Error("Failed");
    }
  
    return res.json();
};

const singlePage = async({params}) => {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const {id} = params;
    const {article} = await getData(id);

    if (session && (session.user.type === 'Admin' || session.user.type === 'Ambassador')) {
    return(
      <div className="flex justify-center h-screen">
        <div className="w-1/2">
          <div className="hero">
            <div className="hero-content flex-col lg:flex-row-reverse">
              <img src={article.imgURL} className="max-w-sm rounded-lg shadow-2xl" />
              <div>
                <h1 className="text-5xl font-bold">{article.title}</h1>
                <p className="py-6">{article.summary}</p>
                <Link href={`../edit-article/${article._id}`}>
                    <button className="btn">Edit</button>
                </Link>
                <DeleteButton id={article._id} route={"articles"} className="btn"/>
              </div>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: article.content }} className={`${styles.articleContent} article-content`}/>
        </div>
      </div>
    )
  }
  else{
    return(
      <div className="flex justify-center h-screen">
        <div className="w-1/2">
          <div className="hero">
            <div className="hero-content flex-col lg:flex-row-reverse">
              <img src={article.imgURL} className="max-w-sm rounded-lg shadow-2xl" />
              <div>
                <h1 className="text-5xl font-bold">{article.title}</h1>
                <p className="py-6">{article.summary}</p>
              </div>
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: article.content }} className={`${styles.articleContent} article-content`}/>
        </div>
      </div>
    )
  }
}

export default singlePage;