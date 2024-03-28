import { useParams } from "react-router-dom";

export const useRecipeId = () => {
  const { id } = useParams();
  return id;
};
