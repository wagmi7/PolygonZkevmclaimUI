import React from 'react';
import { shortenText } from 'src/helpers';
import AddressLabel from './AddressLabel';

const MessageCard = ({
    fromchain,
    tochain,
    deposit,
    claim
}) => {
    // console.log("Deposit", deposit);
    console.log(fromchain, tochain, "messagecard")
    const originAddress = shortenText(deposit.orig_addr, 5);
    const destAddress = shortenText(deposit.dest_addr, 5);

    return (
        <div className='border border-gray-500 w-[500px] rounded-lg p-8 h-[500px]'>
            <div>
                {deposit.claim_tx_hash && <div className='text-green-500 text-center'>This Proof has already been claimed</div>}
                {deposit.ready_for_claim && !deposit.claim_tx_hash && <div className='text-red-500 text-center'>Not Claimed Yet</div>}
                <div className='text-[28px]'>Details of the Proof:</div>

                <div>
                    <div className='flex flex-row'>
                        <h3>Deposit CNT: </h3>
                        <h3>{deposit.deposit_cnt} </h3>
                    </div>
                    {deposit.claim_tx_hash && <div>
                        <div className='flex flex-row justify-between my-2'>
                            <h3 className='text-gray-400'>Claimed txhash:</h3>
                            <AddressLabel
                                chainId={tochain}
                                address={deposit.claim_tx_hash}
                                isTransactionAddress
                                showBlockExplorerLink

                            />
                        </div>
                    </div>}
                    {!deposit.claim_tx_hash && <div>
                        <div className='flex flex-row justify-between my-2'>
                            <h3 className=' text-[14px] text-gray-500'>You can Claim the proof. Click on Claim Button</h3>
                        </div>
                    </div>}
                </div>

            </div>
            <div className='h-[4px] bg-gray-500 w-full my-12 rounded-2xl'></div>
            <div>
                <div className='flex flex-row justify-between my-2'>
                    <h3 className='text=[18px] text-gray-400'>Minted Txhash: </h3>
                    <AddressLabel
                        chainId={fromchain}
                        address={deposit.tx_hash}
                        isTransactionAddress
                        showBlockExplorerLink
                    />
                </div>
                <div className='flex flex-row justify-between my-2'>
                    <h3 className='text=[18px] text-gray-400'>Origin Address: </h3>
                    <AddressLabel
                        chainId={fromchain}
                        address={deposit.orig_addr}
                        showBlockExplorerLink
                        isNormalAddress
                    />
                </div>
                <div className='flex flex-row justify-between my-2'>
                    <h3 className='text=[18px] text-gray-400'>Destination Address: </h3>
                    <AddressLabel
                        chainId={tochain}
                        address={deposit.dest_addr}
                        showBlockExplorerLink
                        isNormalAddress
                    />
                </div>

                <div className='flex flex-row justify-between my-2'>
                    <h3 className='text=[18px] text-gray-400'>Claimable Status: </h3>
                    {!deposit.ready_for_claim && <h3 className='text-red-500'>Not Claimable</h3>}
                    {deposit.ready_for_claim && deposit.claim_tx_hash && <h3 className='text-green-500'> Already Claimed</h3>}
                    {deposit.ready_for_claim && !deposit.claim_tx_hash && <h3 className='text-yellow-500'>Ready for claim</h3>}
                </div>
            </div>

            {!deposit.ready_for_claim && <h3 className='text-red-500'>
                Not Ready to Claim. Please wait
            </h3>}
            {!deposit.claim_tx_hash && <button
                onClick={() => claim(deposit)}
                className='border rounded-lg border-gray-500 px-4 py-2 mt-8'>
                Claim
            </button>}
        </div>
    );
};

export default MessageCard;