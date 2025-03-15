const TronWeb = require('tronweb').TronWeb;

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io', // TRON Testnet
    privateKey: "DC45265E4D76BF234B92FAEF5389B239A8963E8680A37EB41DAA34AC0713A61F", // Use a test account private key
});

const USDT_CONTRACT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"; // USDT (Testnet)

// Function to get USDT balance
async function getUsdtBalance(address) {
    try {
        tronWeb.setAddress(address);
        if (!tronWeb.isAddress(address)) throw new Error("Invalid TRX address");

        console.log(`Checking Testnet USDT balance for: ${address}`);
        const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
        const balance = await contract.methods.balanceOf(address).call();

        return tronWeb.BigNumber(balance).dividedBy(1e6).toNumber();
    } catch (error) {
        console.error(`Error getting Testnet USDT balance:`, error.message || error);
        return 0;
    }
}

// Function to send USDT on Testnet
async function sendUsdt(fromAddress, toAddress, amount) {
    try {
        const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
        const amountInSun = tronWeb.BigNumber(amount).multipliedBy(1e6).toFixed();

        console.log(`Sending ${amount} USDT from ${fromAddress} to ${toAddress} on Testnet`);
        const transaction = await contract.methods.transfer(toAddress, amountInSun).send({
            from: fromAddress
        });

        console.log(`Transaction successful: ${transaction}`);
        return transaction; // Transaction ID
    } catch (error) {
        console.error(`Error sending Testnet USDT:`, error.message || error);
        return null;
    }
}

module.exports = { getUsdtBalance, sendUsdt };
