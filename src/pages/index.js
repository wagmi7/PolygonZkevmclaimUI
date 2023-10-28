import PageContainer from '@/components/PageContainer';
import Actions from '@/components/Actions';
import HomePage from './homePage';

const Home = () => (
  <PageContainer title="Welcome!">
    {/* <Actions switchName="Second Page" /> */}
    <HomePage />
  </PageContainer>
);

export default Home;
