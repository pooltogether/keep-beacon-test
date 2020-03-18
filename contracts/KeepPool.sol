pragma solidity ^0.5.1;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@nomiclabs/buidler/console.sol";
import "./IRandomBeacon.sol";

contract KeepPool is Initializable {

    IRandomBeacon public keepRandomBeacon;
    address payable public owner;

    uint256 public lastRewardId;
    mapping(uint256 => uint256) public rewardRandomNumbers;

    event StartedReward(uint256 indexed rewardId, address indexed sender);
    event ReceivedRewardRandomNumber(uint256 indexed rewardId, uint256 randomNumber);

    function initialize(address payable _owner, IRandomBeacon _keepRandomBeacon) external initializer {
        require(address(_keepRandomBeacon) != address(0), "KeepPool/beacon-undef");
        require(address(_owner) != address(0), "KeepPool/owner-undef");
        owner = _owner;
        keepRandomBeacon = _keepRandomBeacon;
    }

    function startReward() public notRequestInFlight returns (uint256) {
        uint256 gasCost = 800000;
        uint256 entryFee = keepRandomBeacon.entryFeeEstimate(gasCost);
        require(address(this).balance >= entryFee, "KeepPool/insuff-bal");
        lastRewardId = keepRandomBeacon.requestRelayEntry.value(entryFee)(
            address(this),
            "receiveRandomNumber(uint256)",
            gasCost);
        emit StartedReward(lastRewardId, msg.sender);
        return lastRewardId;
    }

    function startRewardCall() external view returns (uint256 rewardId) {
        (bool success, bytes memory returnValue) = address(this).staticcall(abi.encodeWithSignature("startReward()"));
        require(success, "start reward fail");
        rewardId = abi.decode(returnValue, (uint256));
    }

    function receiveRandomNumber(uint256 _randomNumber) external onlyKeepRandomBeacon requestInFlight {
        rewardRandomNumbers[lastRewardId] = _randomNumber;
        emit ReceivedRewardRandomNumber(lastRewardId, _randomNumber);
    }

    function lastRewardRandomNumber() external view returns (uint256 rewardId, uint256 randomNumber) {
        rewardId = lastRewardId;
        randomNumber = rewardRandomNumbers[rewardId];
    }

    function withdraw() external {
        require(msg.sender == owner, "KeepPool/not-owner");
        owner.transfer(address(this).balance);
    }

    /**
     * @dev Prevent receiving ether without explicitly calling a function.
     */
    function() external payable {
    }

    modifier onlyKeepRandomBeacon() {
        require(msg.sender == address(keepRandomBeacon), "KeepPool/only-beacon");
        _;
    }

    modifier requestInFlight() {
        require(rewardRandomNumbers[lastRewardId] == 0, "KeepPool/not-in-flight");
        _;
    }

    modifier notRequestInFlight() {
        require(lastRewardId == 0 || rewardRandomNumbers[lastRewardId] != 0, "KeepPool/in-flight");
        _;
    }
}
