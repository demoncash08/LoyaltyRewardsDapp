// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract TokenClaimPortal is Ownable {
    using SafeMath for uint256;

    IERC20 public WAGMI;

    

    constructor(address _tokenAddress){
        WAGMI=IERC20(_tokenAddress);
    }

    mapping(address=>uint256) public userClaim;
    mapping(address=>bool) public isAdmin;
    mapping(address=>bool) public isSuperAdmin;
    

    modifier onlyAdmin(){
        require(isAdmin[msg.sender] || isSuperAdmin[msg.sender],"You are not authorized");
        _;
    }

    modifier onlySuperAdmin() {
        require(isSuperAdmin[msg.sender], "Not authorized");
        _;
    }


    function addAdmin(address _user) public onlySuperAdmin{
        isAdmin[_user]=true;
    }
       
    function removeAdmin(address _admin) external onlySuperAdmin(){
        isAdmin[_admin]=false;
        //Emit an event here
    }

     function addSuperAdmin(address _user) public onlyOwner{
        isSuperAdmin[_user]=true;
    }
     
    function removeSuperAdmin(address _admin) external onlyOwner(){
        isSuperAdmin[_admin]=false;
        //Emit an event here
    }

    function checkAvailableTokens()public view returns(uint256){
        return userClaim[msg.sender];
    }

    function balanceOfContract()public view returns(uint256){
        return WAGMI.balanceOf(address(this));
    }

    function checkTier(address _user) public view returns(uint8){
        
        uint256 TokenAmount=WAGMI.balanceOf(_user);
        if(TokenAmount<10000*10**18){
            return 0;
        }else if(TokenAmount>=10000*10**18 && TokenAmount<100000*10**18){
            return 1;
        }else if(TokenAmount>=100000*10**18){
            return 2;
        }
        return 0;
    }

    function addTokensAfterPurchase( address _user, uint _amount , uint multiplier) onlyAdmin external{
        uint tokenAmount=_amount/100;
        uint Rewards=1;
        uint div=1;

        uint tier=checkTier(_user);
        if(tier==0){
            Rewards=1;
        }else if( tier==1){
            Rewards=3;
            div=2;
        }else{
            Rewards=2;
        }

        tokenAmount=tokenAmount*Rewards/div;
        tokenAmount=tokenAmount*multiplier;
        userClaim[_user]+=tokenAmount;

    }

    function claimTokens() public{
        require(userClaim[msg.sender]>0,"No tokens to claim");
        require(WAGMI.balanceOf(address(this)) >= userClaim[msg.sender],"Not enough tokens in the pool");
        WAGMI.transfer(msg.sender,userClaim[msg.sender]);
        userClaim[msg.sender]=0;
    }


   

    
}