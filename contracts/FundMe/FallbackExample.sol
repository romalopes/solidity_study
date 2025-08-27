//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract FallbackExample {

    uint256 public result = 0;

    receive() external payable {
        result = 1;
    }

    fallback() external payable {
        result = 2;
    }
}