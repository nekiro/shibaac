import sanitize from 'sanitize-html';
import Panel from '../components/Panel';
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../lib/request';

export default function Index() {
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchApi('GET', '/api/news');

      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Houve um problema', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (!news) {
    return <Panel isLoading={isLoading}></Panel>;
  }

  // TODO: paginate?

  return (
    <>
      {news.map((post) => (
        <Panel key={post.title} header={post.title} date={post.createdAt}>
          <div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
        </Panel>
      ))}
    </>
  );
}
