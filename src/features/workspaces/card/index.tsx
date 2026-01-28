import Image from 'next/image';
import Link from 'next/link';
import { View, Text, Button, Card } from 'reshaped';
import { Icon } from '@/components/icon';
import { getMediaUrl } from '@/libs/api/strapi';
import styles from './styles.module.scss';
import { WorkspaceCardProps } from './types';

export const WorkspaceCard = ({
  workspace,
  onEdit,
  onDelete,
  onClick,
}: WorkspaceCardProps) => {
  return (
    <View width="100%" maxWidth={{ s: '100%', l: 'calc(50% - 8px)' }}>
      <Link
        href={`/workspaces/${workspace.slug}`}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick(workspace);
          }
        }}
      >
        <Card padding={4}>
          <View direction="row" align="center" gap={4} justify="space-between">
            <View direction="row" align="center" gap={4}>
              <div className={styles.workspaceIcon}>
                {workspace.logo ? (
                  <Image
                    src={getMediaUrl(workspace.logo.url) || ''}
                    alt={workspace.logo.alternativeText || workspace.name}
                    width={24}
                    height={24}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 'inherit',
                    }}
                    unoptimized
                  />
                ) : (
                  <Icon name="file-text" size={24} />
                )}
              </div>
              <View>
                <Text variant="body-1" weight="bold">
                  {workspace.name}
                </Text>
                <Text variant="body-2" color="neutral-faded">
                  id: {workspace.slug}
                </Text>
              </View>
            </View>

            <View direction="row" gap={2}>
              <Button
                variant="ghost"
                icon={<Icon name="edit" size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(workspace);
                }}
              />
              <Button
                variant="ghost"
                color="critical"
                icon={<Icon name="trash" size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(workspace.documentId);
                }}
              />
            </View>
          </View>
        </Card>
      </Link>
    </View>
  );
};
