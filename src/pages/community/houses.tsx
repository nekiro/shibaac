import React, { useState, useEffect, useCallback } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import StrippedTable from 'src/components/StrippedTable';
import { fetchApi } from 'src/util/request';
import { withSessionSsr } from 'src/util/session';

interface Player {
  id: number;
  name: string;
  level: number;
}

interface Account {
  id: number;
  name: string;
  players: Player[];
}

export default function HousePage({ user }: any) {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [bid, setBid] = useState({ character: '', amount: '' });
  const [account, setAccount] = useState<Account | null>(null);

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);

    const mappedResponse = {
      id: response.data.account.id,
      name: response.data.account.name,
      players: response.data.account.players,
    };

    setAccount(mappedResponse);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const result = await fetchApi('GET', '/api/houses');

        setHouses(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHouses();
  }, []);

  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBid((prev) => ({ ...prev, [name]: value }));
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (bid.character && bid.amount >= 1000) {
      try {
        const response = await fetchApi(
          'POST',
          `/api/houses/${selectedHouse.id}`,
          {
            data: {
              houseId: selectedHouse.id,
              characterId: Number(bid.character),
              bid: Number(bid.amount),
            },
          }
        );
        console.log('Bid submitted', response);
      } catch (error) {
        console.error('Bid submission failed', error);
      }
    } else {
      console.log('Invalid bid');
    }
  };

  return (
    <>
      <Head title="Houses" />
      <Panel header="Houses">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%' }}>
            <h2>Lista de Casas</h2>
            <StrippedTable
              head={[{ text: 'Name' }, { text: 'Size' }, { text: 'Owner' }]}
            >
              {houses?.map((house) => (
                <tr key={house.id} onClick={() => setSelectedHouse(house)}>
                  <td>{house.name}</td>
                  <td>{house.size}</td>
                  <td>{house.owner}</td>
                </tr>
              ))}
            </StrippedTable>
          </div>
          {selectedHouse && (
            <div style={{ width: '50%' }}>
              <h1>Nome da casa: {selectedHouse.name}</h1>
              <p>
                Owner:
                {selectedHouse.owner === 0
                  ? 'Available for an auction!'
                  : selectedHouse.owner}
              </p>
              <p>Town: Venore</p>{' '}
              <p>Size: {selectedHouse.size} square meters</p>
              <p>Beds: {selectedHouse.beds}</p>
              <p>Monthly rent: {selectedHouse.rent * 1000} gold coins</p>{' '}
              <p>Last bid: {selectedHouse.bid} gold coins</p>
              <p>Highest Bidder: {selectedHouse.highest_bidder}</p>
              <p>
                Last bid date:{' '}
                {new Date(selectedHouse.last_bid * 1000).toLocaleString()}
              </p>
              <form onSubmit={handleBidSubmit}>
                <label>
                  Personagem:
                  <select name="character" onChange={handleBidChange}>
                    <option value="">Selecione</option>
                    {account?.players.map((player) => (
                      <option value={player.id} key={player.id}>
                        {player.name} (Level {player.level})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Bid em gold:
                  <input
                    type="number"
                    min="1000"
                    name="amount"
                    onChange={handleBidChange}
                  />
                </label>
                <button type="submit">Dar Bid</button>
              </form>
              <p>
                Caution! When you bid a house, is NOT possible to cancel the
                bid!
              </p>
            </div>
          )}
        </div>
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
    props: { user },
  };
});
