// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SatelliteDataStorage {
    mapping(uint256 => string) public satelliteDataHashes;

    // Event for storing satellite data hashes
    event SatelliteDataStored(uint256 id, string ipfsHash);

    // Store IPFS hash
    function storeSatelliteData(uint256 _id, string memory _ipfsHash) public {
        satelliteDataHashes[_id] = _ipfsHash;
        emit SatelliteDataStored(_id, _ipfsHash);
    }

    // Fetch IPFS hash
    function getSatelliteData(uint256 _id) public view returns (string memory) {
        return satelliteDataHashes[_id];
    }
    
}
