import sanitize from 'sanitize-html';
import Panel from '../components/Panel';
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../lib/request';

export default function Index() {
  const [news, setNews] = useState(null);

  const fetchNews = useCallback(async () => {
    const response = await fetchApi('GET', '/api/news');
    if (response.success) {
      setNews(response.news);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (!news) {
    return <Panel isLoading={true}></Panel>;
  }

  // TODO: paginate?

  return (
    <>
      {news.map((post) => (
        <Panel key={post.title} header={post.title} date={post.date}>
          <div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
        </Panel>
      ))}
    </>
  );
}
