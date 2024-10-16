import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next";

function MultiSelectNode({ selectedNodes, setSelectedNodes }) {
  console.log(selectedNodes, "selectedNodes from multi Nodedropdown");

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getNodesData(token);
    }
  }, []);

  const getNodesData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };

      const response = await axios.get(api + "/admin/interface/get", {
        headers,
      });
      setNodes(response.data.nodes); // Fetch all available nodes
      console.log(response.data.nodes, "Nodes fetched");
    } catch (error) {
      console.log(error, "error fetching nodes");
    }
  };

  // Filter nodes by recordId (selectedNodes which is the reportInterfaces array)
  const filteredSelectedNodes = selectedNodes
    .map((recordId) => nodes.find((node) => node.recordId === recordId))
    .filter((node) => node !== undefined); // Only include valid matches

  return (
    <div className="w-full">
      <Autocomplete
        multiple
        options={nodes}
        getOptionLabel={(option) => option.identifier} // Display node identifier
        value={filteredSelectedNodes} // Filtered nodes matching the recordId
        onChange={(event, newValue) => {
          setSelectedNodes(newValue.map((node) => node.recordId)); // Update selected nodes with recordId
        }}
        className="w-full"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Multiple Nodes"
            variant="standard"
            className="w-full"
          />
        )}
      />
    </div>
  );
}

export default MultiSelectNode;
