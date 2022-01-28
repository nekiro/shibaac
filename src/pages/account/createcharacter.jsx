import Link from 'next/link';
import React from 'react';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../util/session';

export default function createcharacter() {
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
      <Panel header="Create Character">
        <p>
          Please choose a name, vocation and sex for your character. <br />
          In any case the name must not violate the naming conventions stated in
          the Rules or your character might get deleted or name locked.
        </p>
        <form className="form-horizontal" role="form">
          <fieldset>
            <div className="form-group">
              <label htmlFor="newcharname" className="col-lg-2 control-label">
                Name
              </label>
              <div className="col-lg-10">
                <input
                  type="text"
                  className="form-control"
                  id="newcharname"
                  name="newcharname"
                  placeholder="2 to 30 characters"
                  maxLength={30}
                  required
                />
              </div>
            </div>
            {/* <div class="form-group">
              <label class="col-lg-2 control-label">Vocation</label>
              <div class="col-lg-10">
                <label class="radio-inline">
                  <input
                    type="radio"
                    name="newcharvocation"
                    value="1"
                    checked="checked"
                  />
                  Sorcerer
                </label>
                <label class="radio-inline">
                  <input type="radio" name="newcharvocation" value="2" />
                  Druid
                </label>
                <label class="radio-inline">
                  <input type="radio" name="newcharvocation" value="3" />
                  Paladin
                </label>
                <label class="radio-inline">
                  <input type="radio" name="newcharvocation" value="4" />
                  Knight
                </label>
              </div>
            </div> */}
            <div className="form-group">
              <label className="col-lg-2 control-label">Sex</label>
              <div className="col-lg-10">
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="newcharsex"
                    value="1"
                    //checked="checked"
                  />
                  Male
                </label>
                <label className="radio-inline">
                  <input type="radio" name="newcharsex" value="0" />
                  Female
                </label>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                name="step"
                value="create"
                className="btn btn-primary"
              >
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
