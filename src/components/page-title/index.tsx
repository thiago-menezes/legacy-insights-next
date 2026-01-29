import { Divider, Text, View } from 'reshaped';
import { Breadcrumb, BreadcrumbItem } from './breadcrumb';
import styles from './styles.module.scss';

export interface PageTitle {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageTitle = ({
  title,
  description,
  icon,
  children,
  breadcrumbs,
}: PageTitle) => {
  return (
    <View width="100%">
      <Breadcrumb items={breadcrumbs} />

      <View
        gap={4}
        direction="row"
        align="center"
        justify="space-between"
        className={styles.container}
        paddingBottom={2}
      >
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
        {children}
      </View>

      <Divider />
    </View>
  );
};
