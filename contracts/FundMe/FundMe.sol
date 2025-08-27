// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD
//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant minimunUsd = 5e18;
    address[] public funders;
    mapping(address funder => uint256 amountFunded) public addressToAmountFunded;
    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }
    function fund() public payable {
        // Allow users to send money
        // Have a minimum to send. $5
        // 1. How to send ETH to this contract?
        // require(PriceConverter.getConversionRate(msg.value) > minimunUsd, "didn't send enough eth"); // 1ETH = 1 * 10 ** 18
        require(msg.value.getConversionRate() > minimunUsd, "didn't send enough eth"); // 1ETH = 1 * 10 ** 18
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOnwer {
        // require(msg.sender == i_owner, "Must be the owner");
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address[](0);
        //actually withdraw the funds

        //transfer
        //msg.sender == address
        // payable(msg.sender) == payable address
        // payable(msg.sender).transfer(address(this).balance);
        //send
        // bool sent = payable(msg.sender).send(address(this).balance);
        // require(sent, "Eht wasn't sent by send");
        //call
        (bool success, ) = payable(msg.sender).call{value: address(this).balance }("");
        require(success, "Call failed");

    }
     modifier onlyOnwer() {
        require(msg.sender == i_owner, "Must be the owner");
        _;
     }

     receive() external payable {
        fund();
     }

     fallback() external payable {
        fund();
     }
}