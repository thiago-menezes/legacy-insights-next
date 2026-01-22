import { View, Text } from 'reshaped';

const HomePage = () => {
  return (
    <View gap={4}>
      <Text variant="featured-2" weight="bold">
        Dashboard
      </Text>
      <Text variant="body-2" color="neutral-faded">
        Welcome to your Legacy Insight dashboard. Here you can find an overview
        of your campaigns and integrations.
      </Text>
    </View>
  );
};

export default HomePage;
