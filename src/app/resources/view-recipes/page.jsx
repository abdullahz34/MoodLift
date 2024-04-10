import RecipeList from "@/components/RecipeList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Recipes = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="flex justify-center">
      <RecipeList/>
    </div>
  );
}
export default Recipes;
