import { Web3Button } from "@web3modal/react";
import { useWeb3ModalTheme } from "@web3modal/react";
import { Button } from 'react-bootstrap';
import { Magic } from "magic-sdk";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import axios from "axios";
// import Swal from "swal";

const magic = new Magic('pk_live_095404FAE3C119D7', { 
    network: 'mainnet', // connect to Ethereum Testnet!
});

function Home() {
    const { setTheme } = useWeb3ModalTheme();
    const [address, setAddress] = useState();
    const [discordCode, setDiscordCode] = useState();
    const [discordConnected, setDiscordConnected] = useState(false);
    const [discordButtonText, setDiscordButtonText] = useState("Connect with Discord");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            setDiscordConnected(true);
            setDiscordButtonText("✅ Discord Connected");
            setDiscordCode(code);
        }

        setTheme({
            themeMode: "dark",
            themeColor: "orange",
            themeBackground: "gradient",
        });

      }, []);

    useAccount({
        onConnect({ address, connector, isReconnected }) {
            console.log('Connected', { address, connector, isReconnected });
            setAddress(address);
        },
    })

    function connectDiscord() {
        if (discordConnected) {
            alert("Discord already connected");
            return;
        }
        window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1080238151404093510&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify";
    }

    async function connectMagic() {
        console.log("connectMagic");

        if (!discordConnected || !discordCode) {
            alert("Please connect discord first");
            return;
        }

        const accounts = await magic.wallet.connectWithUI();
        var account = accounts[0];
        console.log("Connected to " + account);
        setAddress(account);
    }

    async function makeConnection() {
        console.log("makeConnection");

        if (!discordConnected || !discordCode) {
            alert("Please connect discord first");
            return;
        }

        if (!address) {
            alert("Please connect a wallet first");
            return;
        }

        const data = { 
            "address" : address, 
            "discordCode" : discordCode 
        };

        console.log(data);

        const response = await axios.post('https://localhost:8081/api/entities/e-25b8394d-978d-4230-bc6f-acf33f7cd8eb/users/connect-discord-and-wallet', data);
        console.log(response);

        if (response.success == true) {
            alert("Connection successfully made, please head back to discord.");
        }
    }

    return (
      <div style={{textAlign: "center", marginTop: "150px"}}>
        <h1>Co-Create - Wallet connection</h1>
        <p style={{margin: "10px 100px 40px 100px"}}>First connect your wallet and then connect your discord with the Co-Create app. Once the connection is done, you will get a Dynamic evolving NFT for all your contributions in Co-Create community.</p>
        <h5 style={{marginBottom: "20px"}}>1. Connect your discord</h5>
        <Button onClick={() => connectDiscord()} variant="secondary" size="sm" style={{height: "40px", borderRadius: "10px", fontWeight:"500", padding:"0 20px", marginTop: "-10px", fontSize: "16px"}}>{discordButtonText}</Button>
        <br />
        <h5 style={{marginBottom: "10px"}}>2. Choose a way to connect wallet</h5>
        <div>
            <Web3Button style={{marginRight: "20px"}} label="I m a pro, already have a wallet!" />
            <Button onClick={() => connectMagic()} variant="primary" size="sm" style={{height: "40px", borderRadius: "10px", fontWeight:"500", padding:"0 20px", marginTop: "-20px", fontSize: "16px"}}>I am new to all this, create a wallet!</Button>
        </div>
        <h5 style={{marginBottom: "20px"}}>3. Final step, Make the connection</h5>
        <Button onClick={() => makeConnection()} variant="secondary" size="sm" style={{height: "40px", borderRadius: "10px", fontWeight:"500", padding:"0 20px", marginTop: "-10px", fontSize: "16px"}}>Make the connection, please!</Button>
      </div>
    );      
  }
  
  export default Home;