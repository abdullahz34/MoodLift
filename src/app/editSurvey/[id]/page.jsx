import EditSurveyForm from "../../../components/EditSurveyForm";
import { useRouter } from "next/navigation";



//locating specific survey by id
const getSurveyById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/surveys/${id}`, {
      cache: "no-store",
      
    });

    if (!res.ok) {
      throw new Error("Failed to fetch survey");
    }
    
    return res.json();
    
  } catch (error) {
    console.log(error);
  }
  
};
//to edit asurvey using identity of id
export default async function EditSurvey({ params }) {
  const { id } = params;
  const { survey } = await getSurveyById(id);
  const { title, description, frequency } = survey;

 

  return <EditSurveyForm id={id} title={title} description={description} frequency={frequency} />;
}