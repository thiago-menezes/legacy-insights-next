import Image from 'next/image';
import { Text, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { ProfileItem } from './profile-item';
import styles from './styles.module.scss';
import { PlatformCardProps } from './types';

export const PlatformCard = ({
  platform,
  onDelete,
  onAdd,
  onUpdate,
}: PlatformCardProps) => {
  return (
    <div className={styles.platformCard}>
      <div className={styles.platformHeader}>
        <div className={styles.platformIcon}>
          {platform.icon.startsWith('/') ? (
            <Image
              src={platform.icon}
              width={40}
              height={40}
              alt={platform.name}
              priority
              className={styles.iconIntegration}
            />
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Icon name={platform.icon as any} size={40} />
          )}
        </div>
        <div className={styles.platformInfo}>
          <Text variant="body-1" weight="bold">
            {platform.name}
          </Text>
          <Text variant="body-2" color="neutral-faded">
            {platform.description}
          </Text>
        </div>
      </div>

      <div className={styles.profilesList}>
        {platform.profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}

        <Button
          className={styles.addProfileButton}
          onClick={() => onAdd(platform.id)}
        >
          <Icon name="plus" size={18} />
          Adicionar novo perfil
        </Button>
      </div>
    </div>
  );
};
