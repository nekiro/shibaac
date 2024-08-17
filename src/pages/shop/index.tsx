import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { FiX } from 'react-icons/fi';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import {
  Box,
  Flex,
  Text,
  Button,
  Image as ChakraImage,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Divider,
} from '@chakra-ui/react';
import Image from 'next/image';

interface Product {
  id: number;
  image: string;
  name: string;
  coins: number;
  quantity: number;
  category: 'itens' | 'outfits' | 'misc' | 'others';
}

type Account = {
  id: string;
  name: string;
  coins: number;
};

export default function Shopping({ user }: any) {
  const [selectedTab, setSelectedTab] = useState<
    'itens' | 'outfits' | 'misc' | 'others'
  >('itens');

  const [products, setProducts] = useState<Product[]>([
    {
      id: 2160,
      image: 'https://vlt.nostalther.com/images/items/2160.gif',
      name: 'Item 1',
      coins: 5,
      quantity: 0,
      category: 'itens',
    },
    {
      id: 2,
      image: 'https://vlt.nostalther.com/images/items/5935.gif',
      name: 'Item 2',
      coins: 5,
      quantity: 0,
      category: 'itens',
    },
    {
      id: 3,
      image: 'https://vlt.nostalther.com/images/items/5935.gif',
      name: 'Item 3',
      coins: 5,
      quantity: 0,
      category: 'itens',
    },
    {
      id: 4,
      image: 'https://vlt.nostalther.com/images/items/5935.gif',
      name: 'Item 4',
      coins: 5,
      quantity: 0,
      category: 'itens',
    },
    {
      id: 5,
      image: 'https://vlt.nostalther.com/images/items/5935.gif',
      name: 'Item 5',
      coins: 5,
      quantity: 0,
      category: 'itens',
    },
    {
      id: 6,
      image:
        'https://vlt.nostalther.com/engine/outfits/animoutfit.php?id=1935&head=38&body=13&legs=82&feet=95',
      name: 'Outfit 1',
      coins: 20,
      quantity: 0,
      category: 'outfits',
    },
  ]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  const toast = useToast();

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    setAccount(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleQuantityChange(productId: number, change: number) {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product,
      ),
    );
    setIsBagOpen(true);
  }

  const totalPaymentCoins = products.reduce(
    (acc, product) => acc + product.coins * product.quantity,
    0,
  );

  async function handlePurchase() {
    const productsToCreate = products.filter((prod) => prod.quantity >= 1);
    const totalToDebit = totalPaymentCoins;

    if (account && account.coins < totalToDebit) {
      console.error('Você não tem moedas suficientes para comprar.');
      return;
    }

    const serealizedProduts = productsToCreate.map((product) => {
      return {
        accountId: account?.id,
        itemid: product.id,
        type: product.category,
        count: product.quantity,
        coins: product.coins,
      };
    });

    try {
      const response = await fetchApi('POST', `/api/shop`, {
        data: serealizedProduts,
      });

      if (response.success) {
        toast({
          position: 'top',
          title: 'Compra realizada com sucesso',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          position: 'top',
          title: response.message,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        });
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          quantity: 0,
        })),
      );
      setIsBagOpen(false);
    } catch (error) {
      console.error('Erro:' + error);
    }
  }

  return (
    <>
      <Head title="Shopping" />
      <Panel header="Shopping">
        <Tabs isLazy>
          <TabList>
            {['itens', 'outfits', 'misc', 'others'].map((tab) => (
              <Tab
                key={tab}
                fontWeight={selectedTab === tab ? 'bold' : 'normal'}
                _selected={{ color: 'rgb(178, 120, 255)' }}
                _hover={{ color: 'rgb(178, 120, 255)' }}
                color="rgb(178, 120, 255)"
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {['itens', 'outfits', 'misc', 'others'].map((tab) => (
              <TabPanel key={tab} p={4} bg="rgb(17, 17, 17)">
                <Flex flexWrap="wrap">
                  {products
                    .filter((product) => product.category === tab)
                    .map((product) => (
                      <Box
                        key={product.id}
                        p={4}
                        border="1px"
                        borderColor="rgb(178, 120, 255)"
                        bg="rgb(14, 14, 14)"
                        borderRadius="md"
                        m={2}
                      >
                        <ChakraImage
                          src={product.image}
                          alt={product.name}
                          boxSize="64px"
                          objectFit="cover"
                          m="auto"
                        />
                        <Text
                          mt={2}
                          fontSize="xl"
                          fontWeight="bold"
                          color="rgb(178, 120, 255)"
                        >
                          {product.name}
                        </Text>
                        <Text my={2} color="rgb(178, 120, 255)">
                          Tibia Coins: {product.coins}
                        </Text>
                        {product.quantity > 0 && (
                          <Text color="green.500">
                            Total: {product.coins * product.quantity}
                          </Text>
                        )}
                        <Flex mt={2} justify="center" align="center">
                          <Button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            size="sm"
                            bg="rgb(14, 14, 14)"
                            color="rgb(178, 120, 255)"
                            _hover={{ bg: 'rgb(17, 17, 17)' }}
                          >
                            -
                          </Button>
                          <Text mx={2} color="rgb(178, 120, 255)">
                            {product.quantity}
                          </Text>
                          <Button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            size="sm"
                            bg="rgb(14, 14, 14)"
                            color="rgb(178, 120, 255)"
                            _hover={{ bg: 'rgb(17, 17, 17)' }}
                          >
                            +
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Panel>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          cursor: 'pointer',
          backgroundColor: 'rgb(178, 120, 255)',
          padding: '10px 20px',
          borderRadius: '5px',
          fontSize: '18px',
          color: '#ffffff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => setIsBagOpen((prev) => !prev)}
      >
        🛍️ Bag
      </div>

      {isBagOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              width: '300px',
              height: '100%',
              backgroundColor: 'rgb(14, 14, 14)',
              boxShadow: '-8px 0 15px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              borderRadius: '24px 0 0 0',
              display: 'flex',
              flexDirection: 'column',
              zIndex: '999',
              color: 'rgb(178, 120, 255)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgb(20, 20, 20)',
                paddingBottom: '10px',
              }}
            >
              <h2>Bag</h2>
              <FiX
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsBagOpen(false)}
              />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
              <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                {products
                  .filter((product) => product.quantity > 0)
                  .map((product, index) => (
                    <li
                      key={product.id}
                      style={{ marginBottom: '20px', position: 'relative' }}
                    >
                      <Box
                        position="relative"
                        width="100%"
                        padding="10px"
                        borderRadius="md"
                        bg="rgb(14, 14, 14)"
                        border="1px solid rgb(20, 20, 20)"
                        mb={index !== products.length - 1 ? '10px' : 0}
                      >
                        <Box
                          position="absolute"
                          left="50%"
                          top="50%"
                          transform="translate(-50%, -50%)"
                          width="calc(100% + 10px)"
                          height="calc(100% + 10px)"
                          backgroundImage="url('/images/contorno.svg')"
                          backgroundSize="cover"
                          backgroundRepeat="no-repeat"
                          zIndex={-1}
                          pointerEvents="none"
                        />
                        <Flex align="center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={50}
                            height={50}
                            style={{
                              marginRight: '10px',
                              objectFit: 'cover',
                            }}
                          />
                          <Box>
                            <Text
                              fontWeight="bold"
                              color="rgb(178, 120, 255)"
                              marginBottom="5px"
                            >
                              {product.name}
                            </Text>
                            <Text color="gray.300" marginBottom="5px">
                              x{product.quantity}
                            </Text>
                            <Text color="gray.300">
                              Tibia Coins: {product.coins * product.quantity}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                      {index !== products.length - 1 && (
                        <Divider borderColor="rgb(20, 20, 20)" />
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                fontWeight: 'bold',
              }}
            >
              <h4 style={{ marginRight: '10px' }}>Total:</h4>
              <span>{totalPaymentCoins} Tibia Coins</span>
            </div>

            <Button
              bg="rgb(14, 14, 14)"
              color="rgb(178, 120, 255)"
              _hover={{ bg: 'rgb(17, 17, 17)' }}
              onClick={() => handlePurchase()}
            >
              Comprar
            </Button>
          </div>
        </>
      )}
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
