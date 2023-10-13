import React from "react";

import {
    recoverPersonalSignature,
} from 'eth-sig-util';
import { JsonRpcBatchProvider } from "@ethersproject/providers";


function Sign() {
    const [inputAddr, setInputAddr] = React.useState();
    const [connectedAccount, setConnectedAccount] = React.useState();
    const [recSign, setRecSign] = React.useState();

    const updateInputAddr = (event) => {
        setInputAddr(event.target.value);
    }

    const signUser = async () => {
        const exampleMessage = 'Sign the message to confirm your wallet';


        try {
            const from = String(inputAddr);
            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from, 'Cryptic Ocean'],
            });

            setRecSign(sign);

            alert('Signed Suucessfully');

            console.log('sign', sign);

        } catch (err) {
            console.error(err.message);
            alert(`${err.message}`)
        }
    }



    const verifyUser = async () => {
        const exampleMessage = 'Sign the message to confirm your wallet';

        const sign = recSign;

        try {
            const from = inputAddr.toLowerCase();

            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;

            const recoveredAddr = recoverPersonalSignature({
                data: msg,
                sig: sign,
            });

            if (recoveredAddr === from) {
                alert(`Successfully verified signer as ${recoveredAddr}`);

                console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
            } else {
                alert(
                    `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
                );


                console.log(
                    `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
                );
                console.log(`Failed comparing ${recoveredAddr} to ${from}`);
            }


            const ecRecoverAddr = await window.ethereum.request({
                method: 'personal_ecRecover',
                params: [msg, sign],
            });
            if (ecRecoverAddr === from) {
                alert(`Successfully ecRecovered signer as ${ecRecoverAddr}`);

                console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
            } else {
                alert(
                    `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`,
                );

                console.log(
                    `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`,
                );
            }
        } catch (err) {
            console.error(err);
        }
    };




    const checkMetamaskIsInstalled = () => {
        if (typeof window.ethereum == 'undefined') {
            alert('Install Metamask');
            console.log('Install Metamask');
        }
    }





    const getMetamaskAccounts = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            setConnectedAccount(accounts[0]);
        }
    }





    React.useEffect(() => {
        checkMetamaskIsInstalled();
        getMetamaskAccounts();
    })

    return (
        <div style={{
            height: "100vh",
            margin: '2rem auto',
        }}>

            <div style={{
                margin: '1rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '0.2px solid grey',
                borderRadius: '0.4rem',
            }}>

                <h2>Metamask Sign and Verify</h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '60%'
                }}>
                    <h3>Your wallet address</h3>

                    <input
                        type="text"
                        value={inputAddr}
                        onChange={updateInputAddr}
                        style={{ width: '80%', height: '2rem', padding: '0.5rem', fontSize: '1.2rem' }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '60%',
                    marginTop: '3rem'
                }}>

                    <button
                        onClick={signUser}
                        style={{
                            fontSize: '1.2rem',
                            padding: '0.5rem',
                            width: '5rem',
                            border: '0.2px solid black',
                            borderRadius: '0.4rem',
                            backgroundColor: '#b4f071',
                            cursor: 'pointer'
                        }}>Sign</button>


                    <button
                        onClick={verifyUser}
                        style={{
                            fontSize: '1.2rem',
                            padding: '0.5rem',
                            width: '5rem',
                            border: '0.2px solid black',
                            borderRadius: '0.4rem',
                            backgroundColor: '#52d984',
                            cursor: 'pointer'
                        }}>Verify</button>
                </div>

            </div>

        </div>
    );
}

export default Sign;