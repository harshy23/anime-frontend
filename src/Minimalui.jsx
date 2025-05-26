import { useState } from "react";
import axios from "axios";
import api from "../api"; // Assuming this is your Axios instance

export default function Minimalui() {
  const [isauthorised, setauthorised] = useState(false);
  const [search, setsearch] = useState("");
  const [message, setmessage] = useState("");

  const [namev, setnamev] = useState("");
  const [emailv, setemailv] = useState("");
  const [passv, setpassv] = useState("");
  const [prefe, setprefe] = useState("");

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");

  function handlelogin(e) {
    e.preventDefault();
    setauthorised(false);
    axios.post("https://animerecoo-api.onrender.com/token/", { username: name, password: pass })
      .then(res => {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setauthorised(true);
        setname("");
        setemail("");
        setpass("");
        setmessage("Login successful!");
      })
      .catch(err => {
        setauthorised(false);
        console.error("Login error:", err);
        setmessage("Login failed: " + (err.response?.data?.detail || err.message));
      });
  }

  function handleregister(e) {
    e.preventDefault();
    setauthorised(false);
    axios.post("https://animerecoo-api.onrender.com/register/", { name: namev, email: emailv, password: passv })
      .then(res => {
        setmessage(res.data.message || "Registration successful!");
        setnamev("");
        setemailv("");
        setpassv("");
      })
      .catch(err => {
        console.error("Registration error:", err);
        setmessage("Registration failed: " + (err.response?.data?.detail || err.message));
      });
  }

  function handelsearch(e) {
    e.preventDefault();
    api.get(`search?name=${search}`)
      .then(res => {
        console.log("Search result:", res.data);
        setmessage(typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2));
        setsearch("");
      })
      .catch(err => {
        console.error("Search error:", err);
        setmessage("Search failed: " + (err.response?.data?.detail || err.message));
      });
  }

  function handelprefe(e) {
    e.preventDefault();
    const prefarray = prefe.split(",").map((words) => words.trim()).filter((word) => word !== "");
    api.post("preferences/", { user_genre: prefarray })
      .then(res => {
        setmessage(res.data.message || "Preferences saved successfully!");
        setprefe("");
      })
      .catch(err => {
        console.error("Error saving preferences:", err);
        setmessage("Failed to save preferences: " + (err.response?.data?.detail || err.message));
      });
  }

  function handelreco(e) {
    e.preventDefault();
    api.get("recommendations/")
      .then(res => {
        console.log("Recommendations:", res.data);
        setmessage(typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2));
      })
      .catch(err => {
        setmessage("Failed to fetch recommendations: " + (err.response?.data?.detail || err.message));
        console.error("Recommendation error:", err);
      });
  }
  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setauthorised(false);
    setmessage("Logged out successfully.");
    setsearch(null);}
    

  return (
    <div className="flex flex-col justify-center items-center gap-28 m-10">
      <div className="flex gap-10">
        <form style={{ width: "90%", border: "1px solid #ccc", borderRadius: "8px", padding: "2rem" }} onSubmit={handleregister} >
          <h1>New User</h1>
          <div style={{ margin: "20px" }}>
            <label htmlFor="namein">Name:</label>
            <input
              id="namein"
              style={{ width: "100%" }}
              type="text"
              value={namev}
              onChange={(e) => setnamev(e.target.value)}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <label htmlFor="emailin">Email:</label>
            <input
              id="emailin"
              type="text"
              style={{ width: "100%" }}
              value={emailv}
              onChange={(e) => setemailv(e.target.value)}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              style={{ width: "100%" }}
              value={passv}
              onChange={(e) => setpassv(e.target.value)}
            />
          </div>
          <button className="p-3 rounded-md m-5 cursor-pointer border-red-400 border-4">Register</button>
        </form>

        <form style={{ width: "90%", border: "1px solid #ccc", borderRadius: "8px", padding: "2rem" }} onSubmit={handlelogin} >
          <h1>Old User</h1>
          <div style={{ margin: "20px" }}>
            <label htmlFor="namei">Name:</label>
            <input
              id="namei"
              style={{ width: "100%" }}
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <label htmlFor="emaili">Email:</label>
            <input
              id="emaili"
              type="text"
              style={{ width: "100%" }}
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <label htmlFor="passwordl">Password:</label>
            <input
              id="passwordl"
              type="password"
              style={{ width: "100%" }}
              value={pass}
              onChange={(e) => setpass(e.target.value)}
            />
          </div>
          <button className="p-3 rounded-md m-5 cursor-pointer border-red-400 border-4">Login</button>
        </form>
      </div>

      {isauthorised && (
        <button
          className="p-3 rounded-md m-5 cursor-pointer border-blue-400 border-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <div className="w-full h-1 flex items-center justify-center">
        <form className="flex rounded-lg border-4 border-red-300 w-4/5" onSubmit={handelsearch} >
          <label htmlFor="search"></label>
          <input
            id="search"
            className="h-full"
            type="text"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="search anime"
          />
          <button className="px-3 rounded-md m-5 cursor-pointer border-red-400 border-4">search</button>
        </form>
      </div>

      <div className="w-full flex items-center justify-center">
        <form className="flex rounded-lg border-4 border-red-300 w-4/5" onSubmit={handelprefe}>
          <label htmlFor="prefe"></label>
          <input
            id="prefe"
            className="h-full"
            type="text"
            value={prefe}
            onChange={(e) => setprefe(e.target.value)}
            placeholder="Enter preferences (e.g., action, fantasy, sci-fi)"
          />
          <button className="px-3 rounded-md m-5 cursor-pointer border-red-400 border-4">save</button>
        </form>
      </div>

      <div className="w-full flex items-center justify-center">
        <form className="flex rounded-lg border-4 border-red-300 w-4/5" onSubmit={handelreco}>
          <button className="px-3 rounded-md m-5 cursor-pointer border-red-400 border-4">recommend anime</button>
        </form>
      </div>

      {message && (
        <pre
          className="text-center mt-5"
          style={{ color: typeof message === "string" && message.includes("failed") ? "red" : "green" }}
        >
          {typeof message === "string" ? message : JSON.stringify(message, null, 2)}
        </pre>
      )}
    </div>
  );
}