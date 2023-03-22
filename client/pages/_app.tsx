import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { AuthContextProvider } from "../components/contexts/authContext";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AuthContextProvider>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
          primaryColor: "red",
          primaryShade: 6,
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </AuthContextProvider>
  );
}
