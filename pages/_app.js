import "tailwindcss/tailwind.css";
import "./style.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></script>
    </>
  );
}

export default MyApp;
