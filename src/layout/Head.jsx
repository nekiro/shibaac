import React from 'react';

import NextHead from 'next/head';
import Script from 'next/script';
import { NextSeo } from 'next-seo';

const Head = ({ title, keyword, description }) => {
  return (
    <>
      <NextHead>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link rel="icon" href={`/favicon.ico`} key="favicon" />
      </NextHead>
      <Script
        strategy="beforeInteractive"
        src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"
      ></Script>
      <Script
        strategy="beforeInteractive"
        src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.js"
      ></Script>
      <Script strategy="beforeInteractive" src="/js/bootstrap.min.js"></Script>
      <NextSeo
        title={title}
        description={description}
        keyword={keyword}
        //anonical={properties.canonical}
        openGraph={{
          title: title,
          description: description,
          //url: properties.canonical,
          locale: 'en',
          site_name: 'SHIBAac',
        }}
      />
    </>
  );
};

Head.defaultProps = {
  title: 'SHIBAac',
  keywords: 'tibia, aac, ots, account creator',
  description: 'Automatic Account Creator',
};

export default Head;
