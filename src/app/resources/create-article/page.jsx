"use client"
import { withAuth } from "@/components/WithAuth";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const CreateArticle = () => {
    const [title, setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [imgURL,setImgURL] = useState('');

    const router = useRouter();
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const res = await fetch("http://localhost:3000/api/articles", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ title, summary, content, imgURL }),
    
          });
    
          if (res.ok) {
            router.push("/resources/view-articles");
            router.refresh();
    
          } else {
            throw new Error("Failed to create an article");
          }
        } catch (error) {
          console.log(error);
        }
      };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/3">
                <h2>Create Article</h2>
                <input type="text" placeholder="Title..." value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered" required/>
                <input type="summary" placeholder="Summary..." value={summary} onChange={(e) => setSummary(e.target.value)} className="input input-bordered" required/>
                <input type="text" placeholder="image url" onChange={(e) => setImgURL(e.target.value)} className="input input-bordered" required/>
                <ReactQuill value={content} onChange={setContent} placeholder="Write your article"/>
                <button type="submit" className="btn mt-1.5">Create article</button>
            </form>
        </div>
    )
}

export default withAuth(CreateArticle);