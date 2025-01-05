// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AgentWallet is Ownable {
    address public agent;
    address public platform;
    mapping(address => uint256) public balances;
    
    event Funded(address token, uint256 amount);
    event ServicePayment(address service, uint256 amount);
    
    constructor(address _agent, address _platform) {
        agent = _agent;
        platform = _platform;
    }
    
    // Fund the wallet
    function fund(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        balances[token] += amount;
        emit Funded(token, amount);
    }
    
    // Pay for service
    function payService(
        address token,
        address service,
        uint256 amount,
        uint256 platformFee
    ) external {
        require(msg.sender == platform, "Only platform can initiate payments");
        require(balances[token] >= amount + platformFee, "Insufficient balance");
        
        // Pay service provider
        require(IERC20(token).transfer(service, amount), "Service payment failed");
        
        // Pay platform fee
        require(IERC20(token).transfer(platform, platformFee), "Platform fee payment failed");
        
        balances[token] -= (amount + platformFee);
        emit ServicePayment(service, amount);
    }
} 