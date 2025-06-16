let web3;
let contract;
let accounts = [];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById("walletAddress").innerText = accounts[0];
    } else {
        alert("Please install MetaMask.");
    }
});

document.getElementById("connectButton").onclick = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    document.getElementById("walletAddress").innerText = accounts[0];
};

document.getElementById("stakeButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    if (amount <= 0) {
        alert("Please enter valid amount.");
        return;
    }
    const amountWei = web3.utils.toWei(amount, "ether");
    const tier = 90;
    await contract.methods.stake(amountWei, tier).send({ from: accounts[0] });
    document.getElementById("statusText").innerText = "Stake Successful";
};

document.getElementById("claimButton").onclick = async () => {
    await contract.methods.claim(0).send({ from: accounts[0] });
    document.getElementById("statusText").innerText = "Reward Claimed";
};

document.getElementById("unstakeButton").onclick = async () => {
    await contract.methods.unstake(0).send({ from: accounts[0] });
    document.getElementById("statusText").innerText = "Unstaked Successfully";
};
