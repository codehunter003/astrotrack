import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Container } from "react-bootstrap";
import { Viewer, Cartesian3 } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const satelliteRegistryABI = [
  satelite,
  registry,
  abi[
    ({
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "position",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "SatelliteUpdated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
      ],
      name: "getSatellite",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "position",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          internalType: "struct SatelliteRegistry.Satellite",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "satellites",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "position",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_position",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_timestamp",
          type: "uint256",
        },
      ],
      name: "updateSatellite",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    })
  ],
]; // Your ABI
const contractAddress = "0xfC01E11F9eC3E3D3831C010227D84Fa3E65b2FFB";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [satelliteId, setSatelliteId] = useState("");
  const [satelliteData, setSatelliteData] = useState({});
  const [satelliteName, setSatelliteName] = useState("");
  const [satellitePosition, setSatellitePosition] = useState("");

  const viewerRef = useRef(null);

  // Initialize Cesium Viewer
  useEffect(() => {
    viewerRef.current = new Viewer("cesiumContainer", {
      terrainProvider: Cesium.createWorldTerrain(),
    });

    return () => {
      viewerRef.current.destroy();
    };
  }, []);

  // Fly to Location
  const flyToLocation = (lat, long, alt) => {
    const viewer = viewerRef.current;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(lat, long, alt),
    });
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        satelliteRegistryABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    }
  };

  const updateSatelliteData = async () => {
    if (contract) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      await contract.updateSatellite(
        satelliteId,
        satelliteName,
        satellitePosition,
        currentTimestamp
      );
      const [lat, long, alt] = satellitePosition.split(",").map(Number);
      flyToLocation(lat, long, alt); // Fly to the updated satellite position
    }
  };

  return (
    <Container>
      <h1>Satellite Registry</h1>
      <Button onClick={connectWallet}>Connect Wallet</Button>

      <Form>
        <Form.Group>
          <Form.Label>Satellite ID</Form.Label>
          <Form.Control
            type="text"
            value={satelliteId}
            onChange={(e) => setSatelliteId(e.target.value)}
          />
        </Form.Group>
      </Form>

      <h3>Update Satellite Data</h3>
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

        <Button onClick={updateSatelliteData}>Update Satellite</Button>
      </Form>

      <div
        id="cesiumContainer"
        style={{ height: "500px", width: "100%" }}
      ></div>
    </Container>
  );
};

export default App;
