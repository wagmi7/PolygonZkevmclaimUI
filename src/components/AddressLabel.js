"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdOpenInNew } from "react-icons/md";
import { AiOutlineCopy } from "react-icons/ai";
import { ImNewTab } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import { shortenText } from 'src/helpers';



const AddressLabel = ({
    address,
    isTransactionAddress,
    isNormalAddress = false,
    showBlockExplorerLink,
    showCopyIntoClipboardButton = true,
    useFullAddress = false,
    enableTransaction = false,
}) => {

    const addressLabel = shortenText(address, 5);

    // const blockExplorerLink = `${chain?.blockExplorerUrl}/${isTransactionAddress ? 'tx' : 'address'
    //     }/${address}`

    const blockExplorerLink = `https://testnet-zkevm.polygonscan.com/${isNormalAddress && 'address'}/${address}`;

    const txhashLink = `https://goerli.etherscan.io/${isTransactionAddress && 'tx'}/${address}`;

    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, "3000");
        }
    }, [isCopied])

    return (
        <div className='flex flex-row gap-1 items-center text-gray-500 hover:text-white'>
            <span>{useFullAddress ? address : addressLabel}</span>
            {showBlockExplorerLink && isNormalAddress && (
                <Link target='_blank' href={blockExplorerLink}><MdOpenInNew style={{ cursor: 'pointer' }} /></Link>
            )}

            {showBlockExplorerLink && isTransactionAddress && (
                <Link target='_blank' href={txhashLink}><MdOpenInNew style={{ cursor: 'pointer' }} /></Link>
            )}

            {showCopyIntoClipboardButton && (
                <div onClick={() => {
                    navigator?.clipboard?.writeText?.(address)
                    setIsCopied(true);
                }}>
                    {isCopied ? <TiTick /> : <AiOutlineCopy className='cursor-pointer' />}
                </div>)}

            {enableTransaction && (
                <Link href={`/transactions/${address}`}>
                    {<ImNewTab />}
                </Link>

            )}

        </div>
    );
};

export default AddressLabel;