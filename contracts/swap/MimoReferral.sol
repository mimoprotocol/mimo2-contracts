pragma solidity >=0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./libraries/SafeMath.sol";
import "./interfaces/IMimoReferral.sol";

contract MimoReferral is IMimoReferral, Ownable {
    using SafeMath for uint256;

    event SetterAdded(address indexed setter);
    event SetterRemoved(address indexed setter);

    mapping(address => bool) private setters;
    mapping(address => address) private referrers;
    mapping(address => uint256) private totals;
    mapping(address => mapping(address => uint256)) private scores;

    modifier onlySetter() {
        require(setters[msg.sender], "MimoReferral: caller is not the setter");
        _;
    }

    constructor() public {
        setters[msg.sender] = true;
    }

    function getReferrer(address user)
        external
        view
        override
        returns (address)
    {
        return referrers[user];
    }

    function register(address user, address referrer)
        external
        override
        onlySetter
        returns (bool)
    {
        if (referrer == address(0)) {
            return true;
        }
        if (referrers[user] == address(0)) {
            referrers[user] = referrer;
            emit Registered(user, referrer);
        }
        return true;
    }

    function recordSwap(address user, uint256 amount)
        external
        payable
        override
        returns (bool)
    {
        address token = msg.sender;
        address referrer = referrers[user];
        totals[token] = totals[token].add(amount);
        if (referrer != address(0)) {
            scores[token][referrer] = scores[token][referrer].add(amount);
        }
        emit SwapRecorded(user, referrer, token, amount);
        return true;
    }

    function referrerScore(address token, address referrer)
        external
        view
        override
        returns (uint256 total, uint256 score)
    {
        return (totals[token], scores[token][referrer]);
    }

    function clearReferrerScore(address token, address referrer)
        external
        override
        onlySetter
        returns (bool)
    {
        uint256 score = scores[token][referrer];
        if (score > 0) {
            totals[token] = totals[token].sub(score);
            scores[token][referrer] = 0;
        }
        return true;
    }

    function checkSetter(address account) external view returns (bool) {
        return setters[account];
    }

    function addSetter(address setter) external onlyOwner {
        if (!setters[setter]) {
            setters[setter] = true;
            emit SetterAdded(setter);
        }
    }

    function removeSetter(address setter) external onlyOwner {
        if (setters[setter]) {
            setters[setter] = false;
            emit SetterRemoved(setter);
        }
    }
}
