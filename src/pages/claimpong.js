import React from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import PageContainer from '@/components/PageContainer';
import Actions from '@/components/Actions';

const Claim = () => {
  // Official address polygonzkevm bridge
  const mainnetBridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
  const testnetBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';

  const mekrleProofString = '/merkle-proof';
  const getClaimsFromAcc = '/bridges/';
  const pingReceiverContractAddress = '0x6D792cb4d69cC3E1e9A2282106Cc0491E796655e';
    console.log(process.env.NEXT_PUBLIC_APP_PVTKEY);
  async function main() {
    const currentProvider = ethers.provider;
    let deployer;
    if (process.env.NEXT_PUBLIC_APP_PVTKEY) {
      deployer = new ethers.Wallet(process.env.NEXT_PUBLIC_APP_PVTKEY, currentProvider);
      console.log('Using pvtKey deployer with address: ', deployer.address);
    } else if (process.env.MNEMONIC) {
      deployer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, 'm/44\'/60\'/0\'/0/0').connect(currentProvider);
      console.log('Using MNEMONIC deployer with address: ', deployer.address);
    } else {
      [deployer] = (await ethers.getSigners());
    }

    let zkEVMBridgeContractAddress;
    let baseURL;
    const networkName = process.env.HARDHAT_NETWORK;

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

    const bridgeFactoryZkeEVm = await ethers.getContractFactory('PolygonZkEVMBridge', deployer);
    const bridgeContractZkeVM = bridgeFactoryZkeEVm.attach(zkEVMBridgeContractAddress);

    const depositAxions = await axiosreq.get(getClaimsFromAcc + pingReceiverContractAddress, {
      params: { limit: 100, offset: 0 },
    });
    const depositsArray = depositAxions.data.deposits;

    if (depositsArray.length === 0) {
      console.log('Not ready yet!');
      return;
    }

    for (let i = 0; i < depositsArray.length; i++) {
      const currentDeposit = depositsArray[i];
      if (currentDeposit.ready_for_claim) {
        const proofAxios = await axiosreq.get(mekrleProofString, {
          params: { deposit_cnt: currentDeposit.deposit_cnt, net_id: currentDeposit.orig_net },
        });

        const { proof } = proofAxios.data;
        const claimTx = await bridgeContractZkeVM.claimMessage(
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
      <button onClick={main}>Claim Funds</button>
    </PageContainer>
  );
};

export default Claim;
