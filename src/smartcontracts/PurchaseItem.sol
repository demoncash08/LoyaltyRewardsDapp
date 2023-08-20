// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract PurchaseItem is Ownable {
    using SafeMath for uint256;

    IERC20 public WAGMI;

    constructor(address _tokenAddress){
        WAGMI=IERC20(_tokenAddress);
    }

    //For the porduct buy function
    mapping(address=>uint256) public sellerClaim;
    mapping(address=>uint256) public stakeHolderClaim;

    function purchaseItem(uint256 _amount,address _seller, address _stakeHolder) public payable {         
         //require(WAGMI.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        
        uint256 sellerAmount = (_amount/ 100)*98; // 98% for the seller
        uint256 stakeholderAmount = _amount - sellerAmount; // 2% for the stakeholder

        sellerClaim[_seller]+=sellerAmount;
        stakeHolderClaim[_stakeHolder]+=stakeholderAmount;
        
    }

    function ClaimBySeller()public {
        require(sellerClaim[msg.sender]<=WAGMI.balanceOf(address(this)),"Not enough tokens in pool");
        WAGMI.transfer(msg.sender,sellerClaim[msg.sender]);
        sellerClaim[msg.sender]=0;
    }

    function ClaimByStakeHolder()public{
        require(stakeHolderClaim[msg.sender]<=WAGMI.balanceOf(address(this)),"Not enough tokens in the pool");
        WAGMI.transfer(msg.sender,stakeHolderClaim[msg.sender]);
        stakeHolderClaim[msg.sender]=0;
    }

}