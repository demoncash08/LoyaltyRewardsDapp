// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.8.6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract token1 is ERC20 {
    constructor() ERC20("Wagmi", "WAGMI ") {
        _mint(msg.sender,690*10**24);
    }
}
