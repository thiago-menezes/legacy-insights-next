import Image from 'next/image';
import Link from 'next/link';
import { View, Text, Button, Card } from 'reshaped';
import { Icon } from '@/components/icon';
import { getMediaUrl } from '@/libs/api/strapi';
import { StrapiWorkspace } from '@/libs/api/workspaces';
import styles from './styles.module.scss';

/**
 * Interface for WorkspaceCard props.
 * Following AGENTS.md guidelines, always use interface for object definitions.
 */
interface WorkspaceCardProps {
  /** The workspace data from Strapi */
  workspace: StrapiWorkspace;
  /** Callback function when edit button is clicked */
  onEdit: (workspace: StrapiWorkspace) => void;
  /** Callback function when delete button is clicked */
  onDelete: (id: string | number) => void;
}

/**
 * WorkspaceCard Component
 *
 * Displays a summary of a workspace and provides actions to edit or delete it.
 *
 * @param {WorkspaceCardProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const WorkspaceCard = ({
  workspace,
  onEdit,
  onDelete,
}: WorkspaceCardProps) => {
  return (
    <Link
      href={`/workspaces/${workspace.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
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
                /{workspace.slug}
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
  );
};
