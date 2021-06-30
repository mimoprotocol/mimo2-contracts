pragma solidity >=0.6.2;

interface IMimoReferral {
    event Registered(address indexed user, address indexed referrer);
    event SwapRecorded(
        address indexed user,
        address indexed referrer,
        address token,
        uint256 amount
    );

    function getReferrer(address user) external view returns (address);

    function register(address user, address referrer) external returns (bool);

    function recordSwap(address user, uint256 amount)
        external
        payable
        returns (bool);

    function referrerScore(address token, address referrer)
        external
        view
        returns (uint256 total, uint256 score);

    function clearReferrerScore(address token, address referrer)
        external
        returns (bool);
}
