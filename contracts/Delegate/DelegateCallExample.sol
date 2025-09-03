//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract B {
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) public payable{
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract A {
    uint public num;
    address public sender;
    uint public value;

    function setVars(address _contract, uint _num) public payable{
        //A's storage is set, B is not modified
        // Get the ABI of the function and call the delegate call.  
        // It will call the function of _contract, but will fill the variable in order(num, send, value)
        (bool successs, bytes memory data) = _contract.delegatecall(abi.encodeWithSignature("setVars(uint256)", _num));
    }
}

contract SmallProxy is Proxy {

    // This is a keccak-256 hash of "eip1966.proxy.impementation" subtracted by 1
    bytes32 private constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    function setImplementation(address newImplementation) public {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    }

    function _implementation() internal view override returns (address implementationAddress) {
        assembly {
            implementationAddress := sload(_IMPLEMENTATION_SLOT)
        }
    }

    // helper function
    function getDataToTransact(uint256 numberToUpdate) public pure returns (bytes memory) {
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);
    }

    function readStorage() public view returns (uint256 valueAtStorageSlotZero) {
        assembly {
            valueAtStorageSlotZero := sload(0)
        }
    }

    function getDataTransaction(uint256 numberToUpdate ) public pure returns(bytes memory) {
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);
    }


}

// SmallPoxy -> ImplementationA

contract ImplementationA {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue;
    }
}

contract ImplementationB {
    uint256 public value;

    function setValue(uint256 newValue) public {
        value = newValue + 2;
    }
}

// function setImplementation(){}
// Transparent Proxy -> Ok, only admins can call functions on the proxy
// anyone else ALWAYS gets sent to the fallback contract.

// UUPS -> Where all upgrade logic is in the implementation contract, and
// you can't have 2 functions with the same function selector.