//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {SimpleStorage} from "./SimpleStorage.sol";

contract StorageFactory { 

    SimpleStorage[] public listOfSimpleContract;

    function createSimpleStorageContract() public {
        listOfSimpleContract.push(new SimpleStorage());
    }

    function addSimpleStorageContractByAddress(address _simple_StorageAddress) public {
        listOfSimpleContract.push(SimpleStorage(_simple_StorageAddress));
    }

    function sFStore(uint256 _simpleStorageIndex, uint256 _newSimpleStorageNumber) public {
        //Address

        //ABI - Application Binary interface
        SimpleStorage simpleStorage = listOfSimpleContract[_simpleStorageIndex];
        simpleStorage.store(_newSimpleStorageNumber);

    }

    function sFGet(uint256 _simpleStorageIndex) public view returns(uint256) {
        return listOfSimpleContract[_simpleStorageIndex].retrieve();
    }

    function sFGetFromAddress(address _simpleStorageAddress) public view returns(uint256) {
        SimpleStorage simpleStorage = SimpleStorage(_simpleStorageAddress);
        return simpleStorage.retrieve();
    }

}
