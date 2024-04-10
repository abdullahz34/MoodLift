import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    return(
        <div>
            <h1>{article.title}</h1>
            <div dangerouslySetInnerHTML={{__html:article.content}}/>
        </div>
    )
}

export default singlePage;