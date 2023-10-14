import { HStack, Link, Text, useColorMode, VStack } from '@chakra-ui/react';

const Footer = () => {
  const { colorMode } = useColorMode();

  return (
    <VStack
      py={4}
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      transition="background 100ms linear"
    >
      <HStack fontSize="sm" fontWeight="600">
        <Text>Created @</Text>
        <Link href="https://github.com/wagmi7" isExternal>
          Polygon Devxam
        </Link>
      </HStack>
    </VStack>
  );
};

export default Footer;
