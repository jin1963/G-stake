let web3;
let accounts;
let contract;
let tokenContract;
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        tokenContract = new web3.eth.Contract([
            {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},
            {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"}
        ], tokenAddress);

        document.getElementById("app").innerHTML = `
          <p><b>Wallet:</b> ${accounts[0]}</p>
          <input id="amount" placeholder="Amount to Stake"/>
          <button onclick="stake()">Stake</button>
          <button onclick="claim()">Claim</button>
        `;
    } else {
        alert("Please install MetaMask");
    }
});

async function stake() {
    const amount = document.getElementById("amount").value;
    const amountWei = web3.utils.toWei(amount, 'ether');
    const allowance = await tokenContract.methods.allowance(accounts[0], contractAddress).call();

    if (BigInt(allowance) < BigInt(amountWei)) {
        await tokenContract.methods.approve(contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from: accounts[0]});
    }
    await contract.methods.stake(amountWei, 180).send({from: accounts[0]});
    alert("Stake Success");
}

async function claim() {
    await contract.methods.claim(0).send({from: accounts[0]});
    alert("Claim Success");
}
