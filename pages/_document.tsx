import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Sui Bond</title>
        <link rel="icon" href="/logo.png" sizes="any" />
      </Head>
      <body className="antialiased font-Jakarta">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
