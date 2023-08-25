import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constant.js";

const connectBtn = document.querySelector("#connect-btn");
const voteBtn = document.querySelector("#vote-btn");
const becomeCandidateBtn = document.querySelector("#becomeCandidate-btn");
const candidatesTopBtn = document.querySelector("#candidatesTop-btn");

connectBtn.onclick = connect;
voteBtn.onclick = vote;
becomeCandidateBtn.onclick = becomeCandidate;
candidatesTopBtn.onclick = showCandidatesTop;

let showList = false;

window.onload = async () => {
    if (window.ethereum) {
        const networkId = await ethereum.request({ method: 'net_version' });
        if (window.ethereum.isConnected()) {
            if (Number(networkId) == 11155111) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const connectedAddress = await signer.getAddress();
                connectBtn.innerHTML = connectedAddress.slice(0, 4) + "..." + connectedAddress.slice(38, 42);
                loadCandidatesList();
            }
        }
    }
};

async function loadCandidatesList() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const candidates = document.querySelector("#candidates");
    let i = 0;
    candidates.innerHTML = "<option value='0'>Choose candidate you want to vote for</option>"
    while (true) {
        try {
            const candidateAddress = await contract.getCandidates(i);
            const candidateName = await contract.getCandidateName(candidateAddress);
            candidates.innerHTML += `<option value="${candidateAddress}">${candidateName}</option>`;
            i++;
        } catch (error) {
            console.log(error);
            break;
        }
    }
}

async function showCandidatesTop() {
    if (typeof window.ethereum != "undefined") {
        const candidatesTopEl = document.querySelector("#candidatesTop-el");
        if (!showList) {
            candidatesTopEl.innerHTML = "";
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            let candidates = [];
            let i = 0;
            while (true) {
                try {
                    const candidateAddress = await contract.getCandidates(i);
                    const candidateName = await contract.getCandidateName(candidateAddress);
                    const votes = await contract.getVotes(candidateAddress);
                    candidates.push({ name: candidateName, votes: votes });
                    i++;
                } catch (error) {
                    console.log(error);
                    break;
                }
            }
            showList = true;
            candidatesTopBtn.innerHTML = "Hide candidates Top";
            if (candidates.length == 0) {
                candidatesTopEl.innerHTML = "There is no candidates yet."
            } else {
                candidates.sort((a, b) => b.votes - a.votes);
                for (let j = 0; j < candidates.length; j++) {
                    const candidate = candidates[j];
                    candidatesTopEl.innerHTML += `<p class = "list-el">Candidate ${candidate.name} has ${candidate.votes} votes</p>`;
                }
            }
        } else {
            candidatesTopEl.innerHTML = "";
            showList = false;
            candidatesTopBtn.innerHTML = "Show funders Top";
        }
    } else {
        noMetamask();
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    popup.innerHTML = `Minning ${transactionResponse.hash}...`;
    popup.style.display = "flex";
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve();
        })
    })
}


async function connect() {
    if (typeof window.ethereum != "undefined") {
        const networkId = await ethereum.request({ method: 'net_version' });
        if (Number(networkId) == 11155111) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const connectedAddress = await signer.getAddress();
            connectBtn.innerHTML = connectedAddress.slice(0, 4) + "..." + connectedAddress.slice(38, 42);
            loadCandidatesList();
        } else {
            switchChain();
        }
    } else {
        noMetamask();
    }
}

async function switchChain() {
    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: "0xaa36a7"
            }]
        });
    } catch (error) {
        if (error.code === 4902) {
            addChain();
        } else {
            console.log(error);
        }
    }
}

async function addChain() {
    try {
        await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                nativeCurrency: {
                    name: "Sepolia Ethereum",
                    symbol: "SETH",
                    decimals: 18
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"]
            }]
        });
        console.log("User added the custom network.");
    } catch (error) {
        console.log(error);
        alert("Failed to add network");
    }
    switchChain();
}

async function becomeCandidate() {
    if (typeof window.ethereum != "undefined") {
        const candidateName = document.querySelector("#candidateName").value.toString();
        if (candidateName != 0) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const transactionResponse = await contract.becomeCandidate(candidateName);
                await listenForTransactionMine(transactionResponse, provider);
                popup.style.display = "none";
                setTimeout(() => {
                    popup.innerHTML = `You succesfully became candidate with the name ${candidateName}`
                    popup.style.display = "flex";
                }, 850);
                setTimeout(() => {
                    popup.style.display = "none";
                }, 3000);
                loadCandidatesList();
            } catch (error) {
                if (error.message.includes('"data":"0xdb31cbf7"')) {
                    popup.style.display = "none";
                    setTimeout(() => {
                        popup.innerHTML = `The candidate already exists.`;
                        popup.style.display = "flex";
                    }, 850);
                    setTimeout(() => {
                        popup.style.display = "none";
                    }, 3000);
                } else {
                    console.log(error);
                }
            }
        } else {
            popup.style.display = "none";
            setTimeout(() => {
                popup.innerHTML = `Please write your name in line above`;
                popup.style.display = "flex";
            }, 850);
            setTimeout(() => {
                popup.style.display = "none";
            }, 3000);
        }
    } else {
        noMetamask();
    }
}

async function vote() {
    if (typeof window.ethereum != "undefined") {
        const candidate = document.querySelector("#candidates").value;
        if (candidate != 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            try {
                const transactionResponse = await contract.Vote(candidate);
                const candidateName = await contract.getCandidateName(candidate);
                await listenForTransactionMine(transactionResponse, provider);
                popup.style.display = "none";
                setTimeout(() => {
                    popup.innerHTML = `You have succesfully voted for ${candidateName}`
                    popup.style.display = "flex";
                }, 850);
                setTimeout(() => {
                    popup.style.display = "none";
                }, 3000);
            } catch (error) {
                if (error.message.includes('"data":"0x17b5ed11"')) {
                    popup.style.display = "none";
                    setTimeout(() => {
                        popup.innerHTML = `You have already voted. Everyone has only one vote.`;
                        popup.style.display = "flex";
                    }, 850);
                    setTimeout(() => {
                        popup.style.display = "none";
                    }, 3000);
                } else {
                    console.log(error.message);
                }
            }
        } else {
            popup.style.display = "none";
            setTimeout(() => {
                popup.innerHTML = `Please choose candidate from the provided list`;
                popup.style.display = "flex";
            }, 850);
            setTimeout(() => {
                popup.style.display = "none";
            }, 3000);
        }
    } else {
        noMetamask();
    }
}

function noMetamask() {
    alert("No MetaMask detected! Please install it");
    window.open("https://metamask.io/", "_blank");
}