import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketplaceABI from './AIModelMarketplace.json';
import TokenABI from './MTKToken.json';

const marketplaceAddress = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";
const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const prov = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(prov);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = prov.getSigner();
          setSigner(signer);
          const addr = await signer.getAddress();
          setAccount(addr);
          refreshBalance(prov, addr);
          fetchListings(prov);
        } catch (error) {
          console.error("Ошибка подключения кошелька:", error);
          alert(JSON.stringify(error, null, 2));
        }
      } else {
        alert("Пожалуйста, установите MetaMask!");
      }
    };
    init();
  }, []);

  const refreshBalance = async (prov = provider, addr = account) => {
    if (prov && addr) {
      try {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          TokenABI.abi || TokenABI,
          prov
        );
        const balance = await tokenContract.balanceOf(addr);
        setTokenBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Ошибка обновления баланса:", error);
        alert(JSON.stringify(error, null, 2));
      }
    }
  };

  const fetchListings = async (prov = provider) => {
    if (prov) {
      try {
        const marketplaceContract = new ethers.Contract(
          marketplaceAddress,
          MarketplaceABI.abi || MarketplaceABI,
          prov
        );
        const listingsFromContract = await marketplaceContract.getAllListings();
        const formattedListings = listingsFromContract.map(listing => ({
          id: listing.id.toNumber ? listing.id.toNumber() : listing.id,
          modelName: listing.modelName,
          description: listing.description,
          modelLink: listing.modelLink,
          price: listing.price,
          seller: listing.seller,
          sold: listing.sold,
        }));
        setListings(formattedListings);
      } catch (error) {
        console.error("Ошибка получения листингов:", error);
        alert(JSON.stringify(error, null, 2));
      }
    }
  };

  // Функция создания нового листинга
  const createListing = async (modelName, description, modelLink, price) => {
    if (!signer) return;
    try {
      const marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        MarketplaceABI.abi || MarketplaceABI,
        signer
      );
      const tx = await marketplaceContract.createListing(
        modelName,
        description,
        modelLink,
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      alert("Листинг создан!");
      fetchListings();
    } catch (error) {
      console.error("Ошибка создания листинга:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };


  const purchaseListing = async (listingId, price) => {
    if (!signer) return;
    try {
      const marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        MarketplaceABI.abi || MarketplaceABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        tokenAddress,
        TokenABI.abi || TokenABI,
        signer
      );
      const approvalTx = await tokenContract.approve(
        marketplaceAddress,
        ethers.utils.parseEther(price)
      );
      await approvalTx.wait();

      const tx = await marketplaceContract.purchaseModel(listingId);
      await tx.wait();
      alert("Модель куплена!");
      refreshBalance();
      fetchListings();
    } catch (error) {
      console.error("Ошибка покупки модели:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div>
      <h1>Маркетплейс AI-моделей</h1>
      {account ? <p>Подключен: {account}</p> : <p>Необходимо подключить кошелек</p>}
      <p>Ваш баланс MTKL: {tokenBalance}</p>
      <button onClick={() => refreshBalance()}>Обновить баланс</button>
      <button onClick={() => fetchListings()}>Обновить список моделей</button>
      
      <hr />
      
      <div>
        <h2>Создать листинг</h2>
        <form onSubmit={e => {
          e.preventDefault();
          const form = e.target;
          const modelName = form.modelName.value;
          const description = form.description.value;
          const modelLink = form.modelLink.value;
          const price = form.price.value;
          createListing(modelName, description, modelLink, price);
          form.reset();
        }}>
          <input name="modelName" placeholder="Название модели" required />
          <br />
          <textarea name="description" placeholder="Описание модели" required />
          <br />
          <input name="modelLink" placeholder="Ссылка на модель (например, IPFS)" required />
          <br />
          <input name="price" placeholder="Цена (MTKL)" required />
          <br />
          <button type="submit">Создать листинг</button>
        </form>
      </div>
      
      <hr />
      
      <div>
        <h2>Доступные AI-модели</h2>
        {listings.length === 0 ? (
          <p>Нет доступных моделей</p>
        ) : (
          listings.map(listing => (
            <div key={listing.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{listing.modelName}</h3>
              <p>{listing.description}</p>
              <p>Цена: {ethers.utils.formatEther(listing.price)} MTKL</p>
              <p>Продавец: {listing.seller}</p>
              <p>Ссылка: <a href={listing.modelLink} target="_blank" rel="noopener noreferrer">Перейти</a></p>
              {!listing.sold ? (
                <button onClick={() => purchaseListing(listing.id, ethers.utils.formatEther(listing.price))}>
                  Купить
                </button>
              ) : (
                <p><strong>Продано</strong></p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
