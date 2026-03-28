import React, { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  //  RUN FLOW
  const runFlow = async () => {
    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post("https://mern-ai-app-flow.onrender.com/api/ask-ai", {
        prompt,
      });

      setResponse(res.data.result);
    } catch (err) {
      console.log(err);
      setStatus("AI failed");
    } finally {
      setLoading(false);
    }
  };

  //  SAVE DATA
  const saveData = async () => {
  try {
    await axios.post("https://mern-ai-app-flow.onrender.com/api/save", {
      prompt,
      response,
    });

    alert(" Saved successfully!");
  } catch (err) {
    console.log(err);
    alert(" Save failed");
  }
};

  //  CLEAR
  const clearAll = () => {
    setPrompt("");
    setResponse("");
    setStatus("");
  };

  //  NODES
  const nodes = [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: {
        label: (
          <input
            type="text"
            placeholder="Enter prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ padding: "5px", width: "150px" }}
          />
        ),
      },
    },
    {
  id: "2",
  position: { x: 400, y: 100 },
  data: {
    label: (
      <div
        style={{
          width: "200px",
          height: "100px",
          display: "flex",
          justifyContent: "center",  
          alignItems: "center",      
          textAlign: "center",        
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9"
        }}
      >
        {loading
          ? " Waiting for response..."
          : response || "Result will appear here"}
      </div>
    ),
  },
},
  ];

  const edges = [{ id: "e1-2", source: "1", target: "2" }];

  return (
    <div style={{ height: "100vh", padding: "10px" }}>
      
      
      <div style={{ marginBottom: "10px" }}>
        <button onClick={runFlow} disabled={!prompt || loading}>
          {loading ? "Running..." : "Run Flow"}
        </button>

        <button onClick={saveData} disabled={!response} style={{ marginLeft: "10px" }}>
          Save
        </button>

        <button onClick={clearAll} style={{ marginLeft: "10px" }}>
          Clear
        </button>
      </div>

      
      <p>{status}</p>

      
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default App;