import { Article } from "@common/types";
import MiniArticle from "@components/common/MiniArticle";
import Style from "@styles/components/common/ArticleList.module.scss";

interface ArticleListProps {
  articles: Article[];
  name: string;
}

export default function ArticleList({ name, articles }: ArticleListProps) {
  return (
    <div className={Style.articleList}>
      <h2>{articles.length > 0 ? name : null}</h2>
      <ul className={Style.articleListContainer}>
        {articles.map((article) => (
          <li key={article.id}>
            <MiniArticle article={article} href={`/article/${article.id}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
