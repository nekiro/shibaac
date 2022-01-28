import React from 'react';
import Panel from '../../components/Panel';
import { useRouter } from 'next/router';

export default function Lost() {
  // if logged in redirect to account page

  const router = useRouter();

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
    <Panel header="Lost Account">
      <div className="panel-body">
        <p>
          The Lost Account Interface can help you to get back your account name
          and password. Please enter your character name and select what you
          want to do.
        </p>
        <br />

        <form className="form-horizontal" onSubmit={handleSubmit}>
          <input type="hidden" name="character" value="" />
          <fieldset>
            <div className="form-group">
              <label htmlFor="nick" className="col-lg-3 control-label">
                Character Name
              </label>
              <div className="col-lg-9">
                <input
                  type="text"
                  className="form-control"
                  id="nick"
                  name="nick"
                  placeholder="2 to 30 characters"
                  maxLength={30}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="select" className="col-lg-3 control-label">
                Option
              </label>
              <div className="col-lg-9">
                <select className="form-control" name="action_type">
                  <option value="email">
                    Use email address to receive account name and a new password
                  </option>
                  <option value="reckey">
                    Use recovery key to change your email and password
                  </option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </Panel>
  );
}
