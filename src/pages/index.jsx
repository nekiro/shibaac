import sanitize from 'sanitize-html';
import Panel from '../components/Panel';
import fetchJson from '../util/fetchJson';
import { useState, useEffect } from 'react';
import Loader from '../components/Loader';

export default function Index() {
  const [news, setNews] = useState(null);

  useEffect(() => {
    (async () => {
      setNews(await fetchJson(`/api/news`));
    })();
  }, []);

  if (!news) {
    return (
      <Panel>
        <Loader />
      </Panel>
    );
  }

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
