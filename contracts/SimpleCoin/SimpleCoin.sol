//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleCoin is ERC20 { 

    constructor() ERC20("Simple Coin", "SC") {
        _mint(msg.sender, 100 * 10e18);
    }
}