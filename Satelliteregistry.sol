// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SatelliteRegistry {
    struct Satellite {
        uint256 id;
        string name;
        string position; // Position can be stored as lat/long/alt (or any suitable structured format)
        uint256 timestamp;
    }

    mapping(uint256 => Satellite) public satellites;

    // Event for satellite data updates
    event SatelliteUpdated(uint256 id, string name, string position, uint256 timestamp);

    // Function to update satellite data
    function updateSatellite(
        uint256 _id,
        string memory _name,
        string memory _position,
        uint256 _timestamp
    ) public {
        satellites[_id] = Satellite(_id, _name, _position, _timestamp);
        emit SatelliteUpdated(_id, _name, _position, _timestamp);
    }

    // Fetch satellite data by ID
    function getSatellite(uint256 _id) public view returns (Satellite memory) {
        return satellites[_id];
    }
    
}
