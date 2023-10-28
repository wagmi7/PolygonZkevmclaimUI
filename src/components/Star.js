import { ConnectWallet } from '@thirdweb-dev/react';
import { FaGithub } from 'react-icons/fa';
import { Button, ButtonGroup, useColorMode } from '@chakra-ui/react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Star = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className='flex flex-row items-center justify-between p-4 bg-zinc-900'>
      <Button onClick={() =>
        router.push('/')
      } className='text-[24px]'>
        Home Page
      </Button>

      <div className='flex gap-4'>
        <Button
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <FaRegMoon /> : <FaRegSun />}
        </Button>
        <ConnectWallet />
      </div>

    </div>
  );
};

export default Star;
