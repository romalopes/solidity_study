//  SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract SimpleStorage {
    uint256 public favoriteNumber;
    event StoredNumber(uint256 indexed oldNumber, uint256 newFavoriteNumber, address sender);
    struct Person {
        uint256 favoriteNumber;
        string name;
    }
    function store(uint256 _favoriteNumber) public virtual {
        emit StoredNumber(favoriteNumber, _favoriteNumber, msg.sender);
        favoriteNumber = _favoriteNumber;

    }

     // uint256[] public anArray;
    Person[] public listOfPeople;

    mapping(string => uint256) public nameToFavoriteNumber;


    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
