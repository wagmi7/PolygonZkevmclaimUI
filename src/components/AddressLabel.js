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
    fromchain,
    tochain
}) => {
    const [frombaseURL , setFrombaseURL] = useState('https://goerli.etherscan.io/');
    const [tobaseURL , setTobaseURL] = useState('https://testnet-zkevm.polygonscan.com/');
    const addressLabel = shortenText(address, 5);
    console.log(frombaseURL , tobaseURL , fromchain , tochain, "passed values");
    // const blockExplorerLink = `${chain?.blockExplorerUrl}/${isTransactionAddress ? 'tx' : 'address'
    //     }/${address}`

    const blockExplorerLink = `${tobaseURL}${isNormalAddress && 'address'}/${address}`;

    const txhashLink = `${frombaseURL}${isTransactionAddress && 'tx'}/${address}`;

    console.log(blockExplorerLink, txhashLink);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (fromchain === '5') {
            setFrombaseURL("https://goerli.etherscan.io/");
        } else if (fromchain === '1') {
            setFrombaseURL("https://etherscan.io/");
        } else if (fromchain === '1442') {
            setFrombaseURL("https://testnet-zkevm.polygonscan.com");
        } else {
            setFrombaseURL("https://zkevm.polygonscan.com/");
        }
    }, [fromchain]);

    useEffect(() => {
        if (tochain === '5') {
            setTobaseURL("https://goerli.etherscan.io/");
        } else if (tochain === '1') {
            setTobaseURL("https://etherscan.io/tx/");
        } else if (tochain === '1442') {
            setTobaseURL("https://testnet-zkevm.polygonscan.com");
        } else {
            setTobaseURL("https://zkevm.polygonscan.com/");
        }
    }, [tochain]);

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
            //     <Link href="https://example.com" passHref>
            //     <a target="_blank" rel="noopener noreferrer">Link text</a>
            //   </Link>
                <a href={blockExplorerLink} rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} />
                </a>
            )}

            {showBlockExplorerLink && isTransactionAddress && (
                <a target='_blank' href={txhashLink} rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} /></a>
            )}

            {showCopyIntoClipboardButton && (
                <div onClick={() => {
                    navigator?.clipboard?.writeText?.(address)
                    setIsCopied(true);
                }}>
                    {isCopied ? <TiTick /> : <AiOutlineCopy className='cursor-pointer' />}
                </div>)}

            {enableTransaction && (
                <a href={`/transactions/${address}`} target='_blank' rel='noopener noreferrer'>
                    {<ImNewTab />}
                </a>

            )}

        </div>
    );
};

export default AddressLabel;