import React, { useState } from 'react';
import axios from 'axios';
import PageContainer from '@/components/PageContainer';
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import MessageCard from '@/components/MessageCard';
import { FormLabel, Input } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';

const Claim = () => {
  const { contract } = useContract("0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7");
  const { mutateAsync: claimMessage, isLoading } = useContractWrite(contract, "claimMessage");
  const [depositsArray, setDepositsArray] = useState();
  const [fromchain, setFromchain] = useState('5');
  const [tochain, setTochain] = useState('1442');

  // Official address polygonzkevm bridge
  const mainnetBridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
  const testnetBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';

  const mekrleProofString = '/merkle-proof';
  const getClaimsFromAcc = '/bridges/';
  const pingReceiverContractAddress = '0x6D792cb4d69cC3E1e9A2282106Cc0491E796655e';

  let baseURL;
  let zkEVMBridgeContractAddress;
  const networkName = 'goerli';
  console.log(fromchain, tochain, "claim ui passed")
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


  const [contractAddress, setContractAddress] = useState('');
  const handleInputChange = (e) => {
    e.preventDefault();
    console.log("E", e.target.value);
    setContractAddress(e.target.value);
  }

  const handleFromChainChange = (event) => {
    console.log(event.target.value, "change");
    setFromchain(event.target.value);
  };

  const handleToChainChange = (event) => {
    setTochain(event.target.value);
  };

  const chainOptions = [
    { label: 'Polygon ZKEVM Mainnet', value: '1101' },
    { label: 'Polygon ZKEVM Testnet', value: '1442' },
    { label: 'Goerli', value: '5' },
    { label: 'ETHEREUM', value: '1' },
  ];
  async function getClaims() {
    // const bridgeFactoryZkeEVm = await ethers.getContractFactory('PolygonZkEVMBridge', deployer);
    // const bridgeContractZkeVM = bridgeFactoryZkeEVm.attach(zkEVMBridgeContractAddress);

    let depositAxions;

    if (contractAddress) {
      depositAxions = await axiosreq.get(getClaimsFromAcc + contractAddress, {
        params: { limit: 100, offset: 0 },
      });
    } else {
      depositAxions = await axiosreq.get(getClaimsFromAcc + pingReceiverContractAddress, {
        params: { limit: 100, offset: 0 },
      });
    }

    console.log(depositAxions, "deposit");
    const depositsArray = depositAxions.data.deposits;
    setDepositsArray(depositsArray);
    toast.success('Successfully created!');

    if (depositsArray.length === 0) {
      console.log('Not ready yet!');
      return;
    }

  }

  async function claim(deposit) {

    const currentDeposit = deposit;
    console.log("Current Deposit", currentDeposit);
    if (currentDeposit.ready_for_claim) {

      const proofAxios = await axiosreq.get(mekrleProofString, {
        params: { deposit_cnt: currentDeposit.deposit_cnt, net_id: currentDeposit.orig_net },
      });

      console.log(proofAxios, "proof axios");
      const { proof } = proofAxios.data;

      const claimTx = await claimMessage({
        args: [
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
        ]
      }
      );
      console.log('claim message successfully sent: ', claimTx.hash);
      toast.loading('Waiting...');
      await claimTx.wait();
      console.log('claim message successfully mined');
      toast.success('Claim message successfully mined');
    } else {
      console.log('bridge not ready for claim');
      toast.error('Bridge not ready for claim');
    }
  }

  const notify = () => toast('Here is your toast.');

  return (
    <div className='flex flex-col items-center justify-center mt-12 gap-8'>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />



      <div className='text-[50px]'>Claim Your Assets across 4 Lxly Chains</div>

      <div className='w-[400px] flex flex-col gap-8' mb={2}>

        <div>
          <h2>Select the From Chain</h2>
          <Select value={fromchain} onChange={handleFromChainChange}>
            {chainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <h2>Select the To Chain</h2>
          <Select value={tochain} onChange={handleToChainChange}>
            {chainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className='text-[20px] mb-2'>Enter the Bridge Address</div>
          <Input
            borderColor='gray.500'
            placeholder='Enter Address'
            value={contractAddress}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        <button
          className='text-[18px] border border-gray-500 mt-8 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700'
          onClick={getClaims}>
          Show Claimable Funds
        </button>
        <div className='flex flex-col items-center justify-center mt-12 gap-8'>
          {!contractAddress && <>
            <code>Example Bridges</code>
            <code>0x977bb1ba20d6df6e8a07178605c6a75618c705ef polygonzkevmtestnetERC20Bridge</code>
            <code>0x4a280052ecd397487e2c77b41cdcf7a5748c3f32 gorelliERC20Bridge</code>
            <code>0x6D792cb4d69cC3E1e9A2282106Cc0491E796655e polygonzkevmtestnetERC721Bridge</code>
          </>}
        </div>
      </div>


      {/* Map through depositsArray and render deposit details */}
      <div className='flex flex-row gap-8 flex-wrap justify-center my-12'>
        {depositsArray && depositsArray.map((deposit, index) => (
          <div key={index}>
            <MessageCard
              deposit={deposit}
              claim={claim}
              fromchain={fromchain}
              tochain={tochain}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Claim;
