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
    isTransactionAddress = false,
    isNormalAddress = false,
    showBlockExplorerLink,
    showCopyIntoClipboardButton = true,
    useFullAddress = false,
    enableTransaction = false,
    chainId,
}) => {
    const addressLabel = shortenText(address, 5);
    const [isCopied, setIsCopied] = useState(false);
    const [baseURL, setBaseURL] = useState('');

    useEffect(() => {
        if (chainId) {
            switch (chainId) {
                case '5':
                    setBaseURL('https://goerli.etherscan.io');
                    break;
                case '1':
                    setBaseURL('https://etherscan.io');
                    break;
                case '1442':
                    setBaseURL('https://testnet-zkevm.polygonscan.com');
                    break;
                case '1101':
                    setBaseURL('https://zkevm.polygonscan.com');
                    break;
                default:
                    setBaseURL('');
                    break;
            }
        }
    }, [chainId])

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
                <>
                    <a href={
                        `${baseURL}/address/${address}`
                    } rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} />
                    </a>
                </>
            )}

            {showBlockExplorerLink && isTransactionAddress && (
                <a href={
                    `${baseURL}/tx/${address}`
                } rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} />
                </a>
            )}



            {/* {showBlockExplorerLink && isNormalAddress && (
                //     <Link href="https://example.com" passHref>
                //     <a target="_blank" rel="noopener noreferrer">Link text</a>
                //   </Link>
                <a href={blockExplorerLink} rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} />
                </a>
            )} */}

            {/* {showBlockExplorerLink && isTransactionAddress && (
                <a target='_blank' href={txhashLink} rel='noopener noreferrer'><MdOpenInNew style={{ cursor: 'pointer' }} /></a>
            )} */}

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