import { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const inpt_value = useRef<HTMLInputElement>(null);
  const [shortenedLink, setShortenedLink] = useState("");
  const [hidden, setHidden] = useState(false);

  const shortenLink = async (text: string) => {
    try {
      const response = await axios.post(
        "https://api-ssl.bitly.com/v4/shorten",
        { long_url: text, domain: "bit.ly" },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_BITLY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.link;
    } catch (error) {
      console.error("Request failed:", error);
      return null;
    }
  };

  const handleClick = async () => {
    const text = inpt_value.current?.value.trim();
    if (text) {
      const shortLink = await shortenLink(text);
      if (shortLink) {
        setShortenedLink(shortLink);
        setHidden(true);
      }
    }
  };

  const handleCopy = async () => {
    if (shortenedLink) {
      try {
        await navigator.clipboard.writeText(shortenedLink);
        toast.success("Link copied to clipboard!"); // Show success toast
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast.error("Failed to copy link. Please try again."); // Show error toast
      }
    } else {
      toast.warning("No link to copy!"); // Show warning toast
    }
  };

  return (
    <div className="container">
      <h1 className="txt">Link shortener</h1>
      <input
        type="text"
        className="inpt_txt"
        placeholder="Enter text here"
        ref={inpt_value}
      />

      <button className="btn" onClick={handleClick}>
        Shorten
      </button>

      {hidden && (
        <div>
          <input
            type="text"
            id="link_input"
            readOnly
            value={shortenedLink}
            className="inpt_txt"
          />
          <button className="btn_c" onClick={handleCopy}>
            Copy Link!
          </button>
        </div>
      )}

      <ToastContainer /> {/* Add ToastContainer to display notifications */}
    </div>
  );
}

export default App;