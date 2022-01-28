import Link from 'next/link';
import React from 'react';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../util/session';

export default function deletecharacter() {
  // if logged in redirect to account page

  //const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    // const response = await fetch('/api/accounts/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: event.target.account.value,
    //     password: event.target.password.value,
    //   }),
    // });

    // if (response.ok) {
    //   // setUser({
    //   //   username: event.target.account.value,
    //   // });
    //   router.push('/account');
    // } else {
    //   // show error
    // }
  }

  return (
    <>
      <Panel header="Delete Character">
        <p>
          To delete a character enter the name of the character and your
          password.
        </p>
        <form className="form-horizontal" role="form">
          <input type="hidden" name="deletecharactersave" value="1" />
          <fieldset>
            <div className="form-group">
              <label htmlFor="delete_name" className="col-lg-2 control-label">
                Name
              </label>
              <div className="col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  name="delete_name"
                  placeholder="4 to 30 characters"
                />
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="delete_password"
                className="col-lg-2 control-label"
              >
                Password
              </label>
              <div className="col-lg-10">
                <input
                  type="password"
                  className="form-control"
                  name="delete_password"
                  placeholder="4 to 30 characters"
                />
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <Link href="/account" passHref>
                <button className="btn btn-default">Back</button>
              </Link>
            </div>
          </fieldset>
        </form>
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
