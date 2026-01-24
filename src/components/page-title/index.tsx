import { Text, View } from 'reshaped';
import styles from './styles.module.scss';

export interface PageTitle {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const PageTitle = ({ title, description, icon }: PageTitle) => {
  return (
    <View gap={1}>
      <View direction="row" align="center" gap={3}>
        {icon}
        <Text variant="title-4" weight="bold" className={styles.title}>
          {title}
        </Text>
      </View>

      <Text variant="body-2" color="neutral-faded">
        {description}
      </Text>
    </View>
  );
};
