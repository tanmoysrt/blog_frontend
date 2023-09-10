import dynamic from "next/dynamic";
import "../styles/globals.css"


const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);


export default function App({ Component, pageProps }) {
  return <>
     <Component {...pageProps} />
      <Toaster />
  </>
}
