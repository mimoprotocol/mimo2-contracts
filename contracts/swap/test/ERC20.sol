pragma solidity =0.6.12;

import "../MimoERC20.sol";

contract ERC20 is MimoERC20 {
    constructor(uint256 _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
