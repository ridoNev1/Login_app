import Head from "next/head";

function Layout(props) {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/5633.png" />
      </Head>
      {props.children}
    </div>
  );
}

export default Layout;
