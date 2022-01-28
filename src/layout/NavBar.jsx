import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../hooks/useUser';

const Navigation = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <nav className="navbar navbar-default" role="navigation">
      <div className="container-fluid">
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                Community
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/highscores">Highscores</Link>
                </li>
                {/* <li>
                  <Link href="/houses">Houses</Link>
                </li>
                <li>
                  <Link href="/guilds">Guilds</Link>
                </li>
                <li>
                  <Link href="/wars">Guild Wars</Link>
                </li> */}
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                Library
                <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/serverinfo">Server Information</Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-left">
            <form
              className="navbar-form navbar-left"
              onSubmit={(event) => {
                event.preventDefault();
                router.push(`/character/${event.target.search.value}`);
              }}
            >
              <input
                type="text"
                maxLength={45}
                name="search"
                autoComplete="new-off"
                className="form-control"
                placeholder="Search character..."
                required
                defaultValue=""
              />
            </form>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            {user ? (
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <strong>{user.name}</strong> <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/account">Account Management</Link>
                  </li>
                  <li>
                    <Link href="/account/logout">Sign out</Link>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/account/register">Sign Up</Link>
                </li>
                <li>
                  <Link href="/account/login">Sign in</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
