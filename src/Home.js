import { Web3Button } from "@web3modal/react";
import { useWeb3ModalTheme } from "@web3modal/react";
import { Button } from 'react-bootstrap';
import { Magic } from "magic-sdk";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import axios from "axios";
import Swal from "sweetalert2";

const magic = new Magic('pk_live_095404FAE3C119D7', { 
    network: 'mainnet', 
});

function Home() {
    const { setTheme } = useWeb3ModalTheme();
    const [address, setAddress] = useState();
    const [discordCode, setDiscordCode] = useState();
    const [discordConnected, setDiscordConnected] = useState(false);
    const [discordButtonText, setDiscordButtonText] = useState("Connect with Discord");
    const [magicButtonText, setMagicButtonText] = useState("I am new to all this, create a wallet!");

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
            Swal.fire({
                icon: 'warning',
                text: 'Discord already connected',
            });
            return;
        }
        window.location.href = "https://discord.com/oauth2/authorize?client_id=1080238151404093510&redirect_uri=https%3A%2F%2Fmaster.d1os0zrv3odqp4.amplifyapp.com%2F&response_type=code&scope=identify";
    }

    async function connectMagic() {
        console.log("connectMagic");

        if (!discordConnected || !discordCode) {
            Swal.fire({
                icon: 'warning',
                text: 'Please connect discord first',
            });
            return;
        }

        const accounts = await magic.wallet.connectWithUI();
        var account = accounts[0];
        console.log("Connected to " + account);
        setMagicButtonText(account.slice(0, 5) + "..." + account.slice(-4));
        setAddress(account);
    }

    async function makeConnection() {
        console.log("makeConnection");

        if (!discordConnected || !discordCode) {
            Swal.fire({
                icon: 'warning',
                text: 'Please connect discord first in Step 1',
            });
            return;
        }

        if (!address) {
            Swal.fire({
                icon: 'warning',
                text: 'Please connect a wallet first in Step 2',
            });
            return;
        }

        const data = { 
            "address": address, 
            "discordCode": discordCode ,
            "entityId": "e-25b8394d-978d-4230-bc6f-acf33f7cd8eb"
        };

        const response = await axios.post('http://localhost:8081/api/entities/e-25b8394d-978d-4230-bc6f-acf33f7cd8eb/users/connect-discord-and-wallet', data);
        if (response.data.success == true) {
            Swal.fire({
                icon: 'success',
                text: 'Connection successfully made, please head back to discord.',
            });
        } else if (response.data.success == false) {
            Swal.fire({
                icon: 'error',
                text: response.data.error ? response.data.error : "Unable to make the connection",
            });
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
            <Button onClick={() => connectMagic()} variant="primary" size="sm" style={{height: "40px", borderRadius: "10px", fontWeight:"500", padding:"0 20px", marginTop: "-20px", fontSize: "16px"}}>{magicButtonText}</Button>
        </div>
        <h5 style={{marginBottom: "20px"}}>3. Final step, Make the connection</h5>
        <Button onClick={() => makeConnection()} variant="secondary" size="sm" style={{height: "40px", borderRadius: "10px", fontWeight:"500", padding:"0 20px", marginTop: "-10px", fontSize: "16px"}}>Make the connection, please!</Button>
      </div>
    );      
  }
  
  export default Home;