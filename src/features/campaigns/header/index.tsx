import Image from 'next/image';
import { useParams } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { UseParamsCampaigns } from '../types';
import { PLATFORM_CONFIG } from './constants';
import styles from './styles.module.scss';

export const CampaignsHeader = () => {
  const { client: platformParam } = useParams<UseParamsCampaigns>();

  const platformConfig = PLATFORM_CONFIG[platformParam];

  return (
    <PageTitle
      icon={
        <div className={styles.iconContainer}>
          <Image
            src={platformConfig.icon}
            alt={platformConfig.title}
            width={32}
            height={32}
            priority
            quality={80}
            className={styles.icon}
          />
        </div>
      }
      title={platformConfig.title}
      description={platformConfig.description}
    />
  );
};
