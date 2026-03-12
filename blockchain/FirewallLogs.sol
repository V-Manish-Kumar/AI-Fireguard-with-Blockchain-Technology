// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FirewallLogs {

    struct Log {
        string eventType;
        string eventHash;
        uint256 timestamp;
    }

    Log[] public logs;

    event LogAdded(string eventType, string eventHash, uint256 timestamp);

    function addLog(string memory _eventType, string memory _eventHash) public {
        logs.push(Log(_eventType, _eventHash, block.timestamp));
        emit LogAdded(_eventType, _eventHash, block.timestamp);
    }

    function getLog(uint256 index) public view returns (string memory, string memory, uint256) {
        Log memory log = logs[index];
        return (log.eventType, log.eventHash, log.timestamp);
    }

    function getLogCount() public view returns (uint256) {
        return logs.length;
    }
}
