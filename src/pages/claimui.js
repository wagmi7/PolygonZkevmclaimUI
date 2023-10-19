import React, { useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/PageContainer';
import { useContract, useContractWrite } from "@thirdweb-dev/react";

const Claim = () => {
  const { contract } = useContract("0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7");
  const { mutateAsync: claimMessage, isLoading } = useContractWrite(contract, "claimMessage");
  const [depositsArray , setDepositsArray] = useState();

  // Official address polygonzkevm bridge
  const mainnetBridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
  const testnetBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';

  const mekrleProofString = '/merkle-proof';
  const getClaimsFromAcc = '/bridges/';
  const pingReceiverContractAddress = '0x6D792cb4d69cC3E1e9A2282106Cc0491E796655e';
    console.log(process.env.NEXT_PUBLIC_APP_PVTKEY);

    let baseURL;
    const networkName = 'goerli';

    // Use mainnet bridge address
    if (networkName === 'polygonZKEVMMainnet' || networkName === 'mainnet') {
      zkEVMBridgeContractAddress = mainnetBridgeAddress;
      baseURL = 'https://bridge-api.zkevm-rpc.com';
    } else if (networkName === 'polygonZKEVMTestnet' || networkName === 'goerli') {
      // Use testnet bridge address
      zkEVMBridgeContractAddress = testnetBridgeAddress;
      baseURL = 'https://bridge-api.public.zkevm-test.net';
    }

    const axiosreq = axios.create({
      baseURL,
    });


  async function getClaims() {
    // const bridgeFactoryZkeEVm = await ethers.getContractFactory('PolygonZkEVMBridge', deployer);
    // const bridgeContractZkeVM = bridgeFactoryZkeEVm.attach(zkEVMBridgeContractAddress);

    
    const depositAxions = await axiosreq.get(getClaimsFromAcc + pingReceiverContractAddress, {
      params: { limit: 100, offset: 0 },
    });

    console.log(depositAxions,"deposit");
    const depositsArray = depositAxions.data.deposits;
    setDepositsArray(depositsArray);

    if (depositsArray.length === 0) {
      console.log('Not ready yet!');
      return;
    }

  }

  async function claim(){

    for (let i = 0; i < depositsArray.length; i++) {
      const currentDeposit = depositsArray[i];
      if (currentDeposit.ready_for_claim) {

        const proofAxios = await axiosreq.get(mekrleProofString, {
          params: { deposit_cnt: currentDeposit.deposit_cnt, net_id: currentDeposit.orig_net },
        });
      
        console.log(proofAxios,"proof axios");
        const { proof } = proofAxios.data;

        const claimTx = await claimMessage( { args : [
          proof.merkle_proof,
          currentDeposit.deposit_cnt,
          proof.main_exit_root,
          proof.rollup_exit_root,
          currentDeposit.orig_net,
          currentDeposit.orig_addr,
          currentDeposit.dest_net,
          currentDeposit.dest_addr,
          currentDeposit.amount,
          currentDeposit.metadata,
        ]}
        );
        console.log('claim message successfully sent: ', claimTx.hash);
        await claimTx.wait();
        console.log('claim message successfully mined');
      } else {
        console.log('bridge not ready for claim');
      }
    }
  }

  return (
    <PageContainer>
      <h1>Claim Page</h1>
      {/* Map through depositsArray and render deposit details */}
      <ul>
        {depositsArray && depositsArray.map((deposit, index) => (
          <li key={index}>
            Deposit CNT: {deposit.deposit_cnt}
            {/* Add more deposit details as needed */}
          </li>
        ))}
      </ul>
      <button onClick={getClaims}>Claim Funds</button>
    </PageContainer>
  );
};

export default Claim;
