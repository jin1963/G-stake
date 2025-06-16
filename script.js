let web3;
let contract;
let accounts;
let tokenContract;
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    tokenContract = new web3.eth.Contract([
      { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
      { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" }
    ], tokenAddress);

    document.getElementById("account").innerText = `Connected: ${accounts[0]}`;
  } else {
    alert("Please install MetaMask!");
  }
}

async function stake() {
  const amount = document.getElementById("amount").value;
  const days = document.getElementById("tier").value;
  const amountWei = web3.utils.toWei(amount, "ether");

  const allowance = await tokenContract.methods.allowance(accounts[0], contractAddress).call();
  if (BigInt(allowance) < BigInt(amountWei)) {
    await tokenContract.methods.approve(contractAddress, web3.utils.toWei("1000000000", "ether")).send({ from: accounts[0] });
  }

  await contract.methods.stake(amountWei, days).send({ from: accounts[0] });
  document.getElementById("status").innerText = "✅ Stake success!";
}

async function claim() {
  const index = document.getElementById("index").value;
  await contract.methods.claim(index).send({ from: accounts[0] });
  document.getElementById("status").innerText = "✅ Claim success!";
}

async function unstake() {
  const index = document.getElementById("index").value;
  await contract.methods.unstake(index).send({ from: accounts[0] });
  document.getElementById("status").innerText = "✅ Unstake success!";
}
