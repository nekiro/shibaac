import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';

import StrippedTable from '../../components/StrippedTable';
import { fetchApi } from '../../lib/request';
import { loadStripe } from '@stripe/stripe-js';
import { withSessionSsr } from '../../lib/session';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';

import {
  Grid,
  useToast,
  Box,
  Text,
  Button,
  Heading,
  Image as ChakraImage,
} from '@chakra-ui/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Package {
  id: number;
  image: string;
  coins: number;
  price: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  image: string;
}

interface Account {
  id: number;
  name: string;
  email: string;
  coins: string;
  players: any[];
}

export default function BuyCoins({ user }: any) {
  const [selectedCard, setSelectedCard] = useState<Package | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isPicPayAvailable, setIsPicPayAvailable] = useState(false);
  const [mercadoPagoMethods, setMercadoPagoMethods] = useState([]);
  const [paymentTypeMethod, setPaymentTypeMethod] = useState();
  const [account, setAccount] = useState<Account | null>(null);
  const [isNameVisible, setIsNameVisible] = useState(false);
  const [email, setEmail] = useState('');

  const toast = useToast();

  const packages: Package[] = [
    { id: 1, image: 'images/coins.png', coins: 50, price: 0.5 },
    { id: 2, image: 'images/coins.png', coins: 100, price: 9 },
    { id: 3, image: 'images/coins.png', coins: 200, price: 17 },
    { id: 4, image: 'images/coins.png', coins: 450, price: 32 },
    { id: 5, image: 'images/coins.png', coins: 650, price: 43 },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Stripe', image: '/images/stripe_br.png' },
    { id: 2, name: 'PicPay', image: '/images/picpay.png' },
    { id: 3, name: 'MercadoPago', image: '/images/mercadopago.png' },
  ];

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);

    setAccount(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchMercadoPagoMethods = async () => {
      try {
        const paymentMethodsResult = await fetchApi(
          'GET',
          '/api/checkout/mercadopago-checkout',
        );

        if (
          paymentMethodsResult.success &&
          Array.isArray(paymentMethodsResult.data)
        ) {
          const activeMethods = paymentMethodsResult.data.filter(
            (method: any) => method.status === 'active',
          );
          setMercadoPagoMethods(activeMethods);
        }
      } catch (error) {
        console.error('Failed to fetch Mercado Pago payment methods', error);
        toast({
          position: 'top',
          title: 'Erro',
          description: 'Erro ao criar a sessão de checkout.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchMercadoPagoMethods();
  }, [toast]);

  const handleCardClick = (pkg: Package) => {
    setSelectedCard(pkg);
  };

  const handlePaymentMethodClick = (method: PaymentMethod) => {
    if (method.name === 'PicPay' && !isPicPayAvailable) {
      alert('PicPay está indisponível no momento.');
      return;
    }

    setSelectedPaymentMethod(method);
  };

  const createMercadoPagoPayload = (
    selectedCard: Package | null,
    email: string,
  ) => {
    if (!selectedCard) {
      throw new Error('Pacote não selecionado');
    }

    return {
      transaction_amount: selectedCard.price,
      description: 'Donation for Tibia coins',
      external_reference: 'TIBIA_COINS_PURCHASE',
      payer: {
        email,
        first_name: '',
        last_name: '',
        accountId: user.id,
      },
      payment_method_id: paymentTypeMethod,
      installments: 1,
      additional_info: {
        items: [
          {
            id: `TIBIA_PACKAGE_${selectedCard.id}`,
            title: `Pacote de ${selectedCard.coins} moedas`,
            description: 'Moedas Tibia para uso no jogo',
            picture_url: selectedCard.image,
            category_id: 'games',
            quantity: 1,
            unit_price: selectedCard.price,
            coins: selectedCard.coins,
          },
        ],
      },
    };
  };

  const handleCheckout = async () => {
    if (!selectedCard || !selectedPaymentMethod) {
      alert('Por favor, selecione um pacote e um método de pagamento.');
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error("Stripe hasn't been initialized yet.");
    }

    try {
      let session;

      if (!selectedCard?.price) {
        throw new Error('Selected card or price is undefined');
      }

      if (selectedPaymentMethod.name === 'Stripe') {
        const result = await fetchApi('POST', '/api/checkout/stripe-checkout', {
          data: { price: selectedCard?.price },
        });

        if (!result.success) {
          throw new Error('Failed to create checkout session');
        }

        session = result.data;

        if (!session || !session.id) {
          throw new Error('Invalid session data');
        }

        await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      } else if (selectedPaymentMethod.name === 'PicPay') {
        // lógica para lidar com o checkout PicPay
      } else if (selectedPaymentMethod.name === 'MercadoPago') {
        const payload = createMercadoPagoPayload(selectedCard, email);

        const result = await fetchApi(
          'POST',
          '/api/checkout/mercadopago-checkout',
          {
            data: payload,
          },
        );

        if (!result.success) {
          console.error('Erro no pagamento', result.message);
          return;
        }

        const init_point = result.data.response.init_point;

        if (init_point) {
          window.location.href = init_point;
        } else {
          console.error('URL init_point não encontrada na resposta');
        }

        if (result.data.response.init_point) {
          window.location.href = result.data.response.init_point;
        } else {
          console.error('URL init_point não encontrada na resposta');
        }
      } else {
        throw new Error('Método de pagamento não suportado');
      }
    } catch (error) {
      console.error('Erro ao criar a sessão de checkout', error);
    }
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaymentTypeMethod(event.target.value);
  };

  return (
    <>
      <Head title="Donate"></Head>
      <Panel header="Informações da Conta">
        <StrippedTable
          head={[
            { text: 'Account' },
            { text: 'E-mail' },
            { text: 'Tibia Coins' },
          ]}
          body={[
            [
              {
                text: isNameVisible ? account?.name : '••••••••',
                details: (
                  <button
                    onClick={() => setIsNameVisible((prev) => !prev)}
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    {isNameVisible ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                ),
              },
              { text: account?.email },
              { text: account?.coins },
            ],
          ]}
        />
      </Panel>

      <Panel header="Buy Coins">
        <h1>Faça a doação para receber as coins</h1>
        <hr style={{ margin: '20px 0' }} />

        <Box borderBottom="1px" borderColor="gray.300" py={4} mb={4}>
          <Text fontSize="lg" mb={2}>
            1. Escolha seu pacote de coins
          </Text>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={4}
          >
            {packages.map((pkg) => (
              <Box
                key={pkg.id}
                p={4}
                cursor="pointer"
                textAlign="center"
                borderWidth={2}
                borderRadius="md"
                borderColor={
                  selectedCard?.id === pkg.id ? 'purple.500' : 'transparent'
                }
                onClick={() => handleCardClick(pkg)}
              >
                <ChakraImage
                  src={pkg.image}
                  alt={`${pkg.coins} Coins`}
                  w="128px"
                  h="64px"
                  m="auto"
                  objectFit="cover"
                />
                <Text mt={2}>{`${pkg.coins} Coins por $${pkg.price}`}</Text>
              </Box>
            ))}
          </Grid>
        </Box>

        <hr style={{ margin: '20px 0' }} />
        {selectedCard && (
          <>
            <h2>2. Método de pagamento</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  style={{
                    border: selectedPaymentMethod
                      ? selectedPaymentMethod.id === method.id
                        ? '3px solid #800080'
                        : '2px solid transparent'
                      : '2px solid transparent',
                    padding: '10px',
                    margin: '10px',
                    flex: '1 0 30%',
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '196px',
                    height: '240px',
                    opacity:
                      method.name === 'PicPay' && !isPicPayAvailable ? 0.5 : 1,
                  }}
                  onClick={() => handlePaymentMethodClick(method)}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '172px',
                      height: '172px',
                      margin: '0 auto 10px',
                    }}
                  >
                    <Image
                      src={method.image}
                      alt={method.name}
                      width={172}
                      height={172}
                      objectFit="cover"
                    />
                  </div>
                  <p>{method.name}</p>
                </div>
              ))}

              {selectedPaymentMethod?.name === 'MercadoPago' && (
                <>
                  <select
                    value={paymentTypeMethod || ''}
                    onChange={handlePaymentMethodChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      marginTop: '10px',
                    }}
                  >
                    <option value="">Selecione um método de pagamento</option>
                    {mercadoPagoMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Digite seu melhor e-mail"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '16px',
                      marginTop: '10px',
                    }}
                  />
                </>
              )}
            </div>
          </>
        )}

        <hr style={{ margin: '20px 0' }} />
        {selectedPaymentMethod && (
          <>
            <Heading as="h2" size="lg" mb={4}>
              3. Prossiga para o pagamento{' '}
              {selectedCard?.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Heading>
            <Box display="flex" justifyContent="space-between" w="100%">
              <Button type="button" colorScheme="red" onClick={() => {}} mr={2}>
                Voltar
              </Button>
              <Button
                type="button"
                colorScheme="purple"
                onClick={handleCheckout}
                ml={2}
              >
                Fazer Pagamento
              </Button>
            </Box>
          </>
        )}
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
