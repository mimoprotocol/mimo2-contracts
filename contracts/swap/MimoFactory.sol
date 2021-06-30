pragma solidity =0.6.12;

import "./interfaces/IMimoPair.sol";
import "./interfaces/IMimoFactory.sol";
import "./MimoPair.sol";

contract MimoFactory is IMimoFactory {
    bytes32 public constant INIT_CODE_PAIR_HASH =
        keccak256(abi.encodePacked(type(MimoPair).creationCode));

    address public override referral;
    address public override feeTo;
    address public override feeToSetter;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view override returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB)
        external
        override
        returns (address pair)
    {
        require(tokenA != tokenB, "Mimo: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "Mimo: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "Mimo: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(MimoPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IMimoPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setReferral(address _referral) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        referral = _referral;
    }
}
