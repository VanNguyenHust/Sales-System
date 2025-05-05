import { useParams } from "react-router-dom";

import { Navigate } from "app/components/Navigate2";

export const BlogArticleNavigate = () => {
  const { articleId } = useParams<{ articleId: string }>();
  return <Navigate to={`/admin/articles/${articleId}`} />;
};
