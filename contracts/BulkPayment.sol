// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BulkPayment {
  address public owner;

  constructor(address ownerAddress) {
    owner = ownerAddress;
  }

  function sendPayments(address payable[] memory addressList, uint[] memory amounts) payable public ownerOnly {
    require(addressList.length == amounts.length, 'Address list and amounts must be of the same length.');
    for(uint i = 0; i < amounts.length; i++) {
      addressList[i].transfer(amounts[i]);
    }
  }

  modifier ownerOnly {
    require(msg.sender == owner);
    _;
  }
}
