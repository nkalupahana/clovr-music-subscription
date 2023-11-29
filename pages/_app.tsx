import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import {Layout} from "./layout";
import MusicProvider from "@/context/MusicContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <MusicProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MusicProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
