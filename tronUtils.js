const TronWeb = require('tronweb').TronWeb;

// Initialize TronWeb (Use TRON Nile Testnet)
const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
});

// USDT Contract Address (Nile Testnet)
const USDT_CONTRACT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

// Function to get USDT balance of a TRC20 address
async function getUsdtBalance(address) {
    try {
        // Set a dummy owner address to avoid "owner_address isn't set" error
        tronWeb.setAddress(address);

        if (!tronWeb.isAddress(address)) {
            throw new Error("Invalid Tron address format");
        }

        console.log(`Checking USDT balance for address: ${address}`);
        console.log(`Using contract: ${USDT_CONTRACT_ADDRESS}`);

        const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
        const balance = await contract.methods.balanceOf(address).call();
        
        console.log("Raw balance:", balance.toString()); // Debugging output

        const formattedBalance = tronWeb.BigNumber(balance).dividedBy(1e6).toNumber();
        return formattedBalance;
    } catch (error) {
        console.error(`Error getting USDT balance for address ${address}:`, error.message || error);
        return 0;
    }
}

module.exports = { getUsdtBalance };
