AI Model Marketplace with MTKL Token

This project is a decentralized marketplace for AI models where users can list and purchase models using the MTKL token (an ERC‑20 token). The project consists of two main parts:

Smart Contracts (Solidity):

MTKToken.sol: A standard ERC‑20 token contract for MTKL.
AIModelMarketplace.sol: A marketplace contract that allows users to create listings, purchase models, and retrieve the list of available listings via the getAllListings function.
Frontend (React):
A React application that connects to MetaMask, displays the user's MTKL token balance, retrieves the list of listings from the blockchain, allows sellers to create listings, and enables buyers to purchase models. The frontend interacts with the contracts using ethers.js.

Features
User Authentication & Wallet Integration:
Connect your MetaMask wallet to interact with the blockchain.

Token Balance Display:
View your current MTKL token balance and refresh it on demand.

AI Model Listings:

Sellers can create a listing by providing the model name, description, a link to the model (e.g., IPFS), and the price (in MTKL tokens).
The marketplace fetches the list of listings directly from the smart contract using the getAllListings function.
Purchase Flow:
Buyers can view model details and purchase a model. The app first performs an approve for token transfer and then calls the purchase function in the marketplace contract. The UI updates to reflect the sale.

Project Structure

![struct](https://github.com/user-attachments/assets/adc2d74c-3851-4a76-a3d1-914573c43e7d)


Prerequisites
Node.js (v14 or higher)
npm
Hardhat
MetaMask (browser extension)
Basic knowledge of Solidity and React

Installation and Setup

1. Smart Contracts
1.1 Install Dependencies
In the root directory of your Hardhat project, run:

bash
npm install --save-dev hardhat @openzeppelin/contracts
1.2 Compile the Contracts
Compile the smart contracts by running:

bash
npx hardhat compile
This command generates artifacts (including ABI files) in the artifacts folder.

1.3 Deploy the Contracts
Start a local Hardhat node:

bash

npx hardhat node
Deploy the MTKToken contract:

bash

npx hardhat run scripts/deploy.js --network localhost
The deployed token address will be printed in the console.

Deploy the AIModelMarketplace contract:

In deployMarketplace.js, update the token address (you can pass it via an environment variable or directly in the code).
Run:
bash
npx hardhat run scripts/deployMarketplace.js --network localhost
The deployed marketplace address will be printed in the console.

2. Frontend
2.1 Setup React Application
Navigate to the frontend folder:
bash
cd frontend
Install dependencies:
bash
npm install
2.2 Configuration
Open src/App.js and update the contract addresses (marketplaceAddress and tokenAddress) with the addresses obtained from the deployment steps.

2.3 Run the React Application
Start the frontend application by running:

bash
npm start

![Снимок экрана 2025-02-28 041506](https://github.com/user-attachments/assets/b719c432-ebb4-4969-bc19-839dad600bd9)




Your application will be available at http://localhost:3000. When loaded, MetaMask will prompt you to connect your wallet. After connection, you'll be able to view your token balance, create listings, and purchase models.

Usage
Connecting the Wallet:
When you open the application, MetaMask will ask for permission to connect your wallet. Once connected, your account address will be displayed.

Viewing Token Balance:
Your MTKL token balance is displayed on the page. Use the "Refresh Balance" button to update it.

![Снимок экрана 2025-02-28 041627](https://github.com/user-attachments/assets/c4ef475e-2ab8-46c9-b7b7-8f9cef560934)




Creating a Listing:
Fill out the form with the model name, description, a link (e.g., an IPFS URL), and the price in MTKL tokens. After submitting, the listing is created on the blockchain and the UI updates by fetching the latest listings.

![Снимок экрана 2025-02-28 041846](https://github.com/user-attachments/assets/d1701e7a-2a79-4931-98ea-abc6ce9e51fa)




Purchasing a Model:
To purchase a model, click the "Buy" button next to the listing. The application will handle the token approval and execute the purchase via the smart contract. After the purchase, the listing is marked as sold, and your balance is updated.

![Снимок экрана 2025-02-28 041904](https://github.com/user-attachments/assets/89956066-72c4-4968-b944-ac183630b406)

![Снимок экрана 2025-02-28 041948](https://github.com/user-attachments/assets/5ade843f-cda7-4f40-92f2-e5505115071f)

![Снимок экрана 2025-02-28 042032](https://github.com/user-attachments/assets/eafdc241-8e7e-4d5b-8d91-c7ab969f1532)

![Снимок экрана 2025-02-28 042049](https://github.com/user-attachments/assets/52db68f7-f10e-4193-93e4-71787fcc7402)




Notes
Fetching Listings:
The function getAllListings in the marketplace contract should return an array of listings. If the contract uses a mapping for storage, additional logic may be required (such as maintaining an array of listing IDs or using events for indexing).

Error Handling:
In this example, errors are logged to the console and shown via alerts. In a production environment, consider using a more robust notification system.

License
This project is licensed under the MIT License.

Acknowledgements
OpenZeppelin for providing secure and audited smart contract libraries.
Hardhat for a powerful development environment for smart contracts.
The React community for its tools and libraries that simplify frontend development.

