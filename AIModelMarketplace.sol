// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract AIModelMarketplace {
    struct Listing {
        uint256 id;
        string modelName;
        string description;
        string modelLink;
        uint256 price;
        address seller;
        bool sold;
    }

    Listing[] public listings;
    uint256 public nextId;
    address public tokenAddress;

    event ListingCreated(uint256 indexed id, string modelName, uint256 price, address indexed seller);
    event ModelPurchased(uint256 indexed id, address indexed buyer);

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
        nextId = 1;
    }

    function createListing(
        string calldata modelName,
        string calldata description,
        string calldata modelLink,
        uint256 price
    ) external {
        listings.push(Listing({
            id: nextId,
            modelName: modelName,
            description: description,
            modelLink: modelLink,
            price: price,
            seller: msg.sender,
            sold: false
        }));
        emit ListingCreated(nextId, modelName, price, msg.sender);
        nextId++;
    }

    function purchaseModel(uint256 listingId) external {
        uint256 index = listingId - 1;
        require(index < listings.length, "Listing does not exist");
        Listing storage listing = listings[index];
        require(!listing.sold, "Listing already sold");

        IERC20 token = IERC20(tokenAddress);
        bool success = token.transferFrom(msg.sender, listing.seller, listing.price);
        require(success, "Token transfer failed");

        listing.sold = true;
        emit ModelPurchased(listingId, msg.sender);
    }

    function getAllListings() external view returns (Listing[] memory) {
        return listings;
    }
}
