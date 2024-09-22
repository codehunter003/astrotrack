// import React, { useState } from "react";
// import HomePage from "./Homepage"; // Basic HTML page
// import SatelliteVisualization from "./SatelliteVisualization"; // Updated Cesium component

//const App = () => {
//  const [showCesium, setShowCesium] = useState(false);

// Function to switch to the Cesium view
//const switchToCesium = () => {
//setShowCesium(true);
//};

//return (
//<div className="App">
//{" "}
//{/* Render the HomePage or SatelliteVisualization based on the state */}
//{" "}
//{showCesium ? (
//<SatelliteVisualization />
//) : (
//<Satellite switchToCesium={switchToCesium} />
//)}
//</div>
//);
//};
// export default App;
import React, { useState } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Container } from "react-bootstrap";

// ABI and Contract Address (replace with your contract's ABI and deployed address)
const satelliteRegistryABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_position", type: "string" },
      { internalType: "uint256", name: "_timestamp", type: "uint256" },
    ],
    name: "updateSatellite",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getSatellite",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "position", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct SatelliteRegistry.Satellite",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0xfC01E11F9eC3E3D3831C010227D84Fa3E65b2FFB"; // Replace with your contract's deployed address

const App = () => {
  // State Variables
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [satelliteId, setSatelliteId] = useState("");
  const [satelliteData, setSatelliteData] = useState({});
  const [satelliteName, setSatelliteName] = useState("");
  const [satellitePosition, setSatellitePosition] = useState("");
  const [timestamp, setTimestamp] = useState("");

  // Connect MetaMask and set up provider, signer, and contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request wallet connection
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        satelliteRegistryABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      console.log("Connected to contract:", contract);
    } else {
      alert("Please install MetaMask to interact with this app.");
    }
  };

  // Fetch satellite data from the contract
  const getSatelliteData = async () => {
    if (contract) {
      const data = await contract.getSatellite(satelliteId);
      setSatelliteData({
        id: data.id.toString(),
        name: data.name,
        position: data.position,
        timestamp: new Date(data.timestamp.toNumber() * 1000).toLocaleString(),
      });
    }
  };

  // Update satellite data in the contract
  const updateSatelliteData = async () => {
    if (contract) {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp
      await contract.updateSatellite(
        satelliteId,
        satelliteName,
        satellitePosition,
        currentTimestamp
      );
      alert("Satellite data updated!");
      // Fly to the satellite's position on Cesium globe
      const [lat, long, alt] = satellitePosition.split(",").map(Number);
      flyToLocation(lat, long, alt); // Call the Cesium flyTo function here
    }
  };

  return (
    <Container>
      <h1>Satellite Registry</h1>
      <Button onClick={connectWallet} className="mb-3">
        Connect Wallet
      </Button>

      <Form>
        <Form.Group>
          <Form.Label>Satellite ID</Form.Label>
          <Form.Control
            type="text"
            value={satelliteId}
            onChange={(e) => setSatelliteId(e.target.value)}
          />
        </Form.Group>
        <Button onClick={getSatelliteData} className="mt-2">
          Get Satellite Data
        </Button>
      </Form>

      {satelliteData && satelliteData.name && (
        <div className="mt-3">
          <h2>Satellite Data:</h2>
          <p>
            <strong>ID:</strong> {satelliteData.id}
          </p>
          <p>
            <strong>Name:</strong> {satelliteData.name}
          </p>
          <p>
            <strong>Position:</strong> {satelliteData.position}
          </p>
          <p>
            <strong>Last Updated:</strong> {satelliteData.timestamp}
          </p>
        </div>
      )}

      <h3 className="mt-4">Update Satellite Data</h3>
      <Form>
        <Form.Group>
          <Form.Label>Satellite Name</Form.Label>
          <Form.Control
            type="text"
            value={satelliteName}
            onChange={(e) => setSatelliteName(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Position (lat, long, alt)</Form.Label>
          <Form.Control
            type="text"
            value={satellitePosition}
            onChange={(e) => setSatellitePosition(e.target.value)}
          />
        </Form.Group>

        <Button onClick={updateSatelliteData} className="mt-2">
          Update Satellite
        </Button>
      </Form>
    </Container>
  );
};

export default App;
