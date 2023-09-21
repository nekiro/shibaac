import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';

import Button from 'src/components/Button';
import StrippedTable from 'src/components/StrippedTable';
import { fetchApi } from 'src/util/request';
import { loadStripe } from '@stripe/stripe-js';
import { withSessionSsr } from 'src/util/session';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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

type ApiResponse = {
  message: string;
  success: boolean;
  data: any;
};

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
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isPicPayAvailable, setIsPicPayAvailable] = useState(false);
  const [mercadoPagoMethods, setMercadoPagoMethods] = useState([]);
  const [paymentTypeMethod, setPaymentTypeMethod] = useState();
  const [account, setAccount] = useState<Account | null>(null);
  const [isNameVisible, setIsNameVisible] = useState(false);
  const [email, setEmail] = useState('');

  const packages: Package[] = [
    { id: 1, image: 'images/coins.png', coins: 50, price: 0.5 },
    { id: 2, image: 'images/coins.png', coins: 100, price: 9 },
    { id: 3, image: 'images/coins.png', coins: 200, price: 17 },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Stripe', image: 'images/stripe_br.png' },
    { id: 2, name: 'PicPay', image: 'images/picpay.png' },
    { id: 3, name: 'MercadoPago', image: 'images/mercadopago.png' },
  ];

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);

    setAccount(response.data.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchMercadoPagoMethods = async () => {
      try {
        const paymentMethodsResult = await fetchApi(
          'GET',
          '/api/checkout/mercadopago-checkout'
        );

        if (paymentMethodsResult.success) {
          const activeMethods = paymentMethodsResult.data.filter(
            (method: any) => method.status === 'active'
          );
          setMercadoPagoMethods(activeMethods);
        }
      } catch (error) {
        console.error('Failed to fetch Mercado Pago payment methods', error);
      }
    };

    fetchMercadoPagoMethods();
  }, []);

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
    email: string
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
          }
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
    event: React.ChangeEvent<HTMLSelectElement>
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
        >
          <tr>
            <td>
              {isNameVisible ? account?.name : '••••••••'}
              <button
                onClick={() => setIsNameVisible((prev) => !prev)}
                style={{
                  marginLeft: '8px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                {isNameVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </td>
            <td>{account?.email}</td>
            <td>{account?.coins}</td>
          </tr>
        </StrippedTable>
      </Panel>

      <Panel header="Buy Coins">
        <h1>Faça a doação para receber as coins</h1>
        <hr style={{ margin: '20px 0' }} />
        <h2>1. Escolha seu pacote de coins</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                border: selectedCard
                  ? selectedCard.id === pkg.id
                    ? '3px solid #800080'
                    : '2px solid transparent'
                  : '2px solid transparent',
                padding: '10px',
                margin: '10px',
                flex: '1 0 30%',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={() => handleCardClick(pkg)}
            >
              <img
                src={pkg.image}
                alt={`${pkg.coins} Coins`}
                style={{
                  width: '128px',
                  height: '64px',
                  margin: '0 auto',
                  objectFit: 'cover',
                }}
              />
              <p>{`${pkg.coins} Coins por $${pkg.price}`}</p>
            </div>
          ))}
        </div>
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
                  <img
                    src={method.image}
                    alt={method.name}
                    style={{
                      width: '172px',
                      height: '172px',
                      margin: '0 auto 10px',
                      objectFit: 'cover',
                    }}
                  />
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
            <h2>
              3. Prossiga para o pagamento{' '}
              {selectedCard?.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </h2>
            <div className="button-group">
              <Button
                type="button"
                btnType="danger"
                value="< Voltar"
                style={{ marginRight: '20px' }}
              />
              <Button
                type="button"
                btnType="primary"
                value="Fazer Pagamento"
                onClick={handleCheckout}
              />
            </div>
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
