import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from 'src/util/request';
import Head from 'src/layout/Head';
import Panel from 'src/components/Panel';
import { withSessionSsr } from 'src/util/session';

interface INewsList {
  authorId: number;
  content: string;
  createdAt: string;
  id: number;
  imageUrl: string;
  playerNick: string;
  title: string;
}

function AdminPanel() {
  const [newsList, setNewsList] = useState<INewsList[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchApi('GET', '/api/news');
        setNewsList(response.data.news);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  async function handleDelete(newsId: number) {
    try {
      await fetchApi('DELETE', `/api/news/${newsId}`);
      setNewsList((prevList) => prevList.filter((news) => news.id !== newsId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head title="Admin Panel" />
      <Panel header="Admin Panel">
        <Link href="/admin/createnews">
          <a className="btn btn-primary mb-3">Create News</a>
        </Link>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((news, index) => (
              <tr key={index}>
                <td>{news.id}</td>
                <td>{news.title}</td>
                <td>{news.playerNick}</td>
                <td>
                  <Link href={`/admin/editNews/${news.id}`}>
                    <a className="btn btn-secondary mr-2">Edit</a>
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(news.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (!user) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default AdminPanel;
