// TODO: implement proper 404 page

export default function Custom404() {
  return null;
}

// breaks CLI auto deployment, Error: `redirect` can not be returned from getStaticProps during prerendering (/404)
// export const getStaticProps = () => {
//   return {
//     redirect: {
//       destination: '/',
//     },
//   };
// };
