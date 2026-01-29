import { Text, Button, View, Tooltip, Badge } from 'reshaped';
import { Icon } from '@/components/icon';
import { STATUS_CONFIG, PROCESS_STATUS_CONFIG } from './constants';
import styles from './styles.module.scss';
import { ProfileItemProps } from './types';

export const ProfileItem = ({
  profile,
  onDelete,
  onEdit,
  onValidate,
  onProcess,
  onDetails,
}: ProfileItemProps) => {
  const statusConfig =
    STATUS_CONFIG[profile.status] || STATUS_CONFIG.disconnected;
  const processStatusConfig = profile.processStatus
    ? PROCESS_STATUS_CONFIG[profile.processStatus]
    : null;

  return (
    <div className={styles.profileItem}>
      <div className={styles.profileInfo}>
        <Text variant="body-2" weight="medium" className={styles.profileName}>
          {profile.name}
        </Text>

        <View direction="row" align="center" gap={2}>
          <div className={styles.profileStatus}>
            <span
              className={`${styles.statusDot} ${
                profile.status === 'connected'
                  ? styles.statusDot_connected
                  : styles.statusDot_disconnected
              }`}
            />
            <Text
              variant="body-3"
              color={
                statusConfig.color === 'positive' ? 'positive' : 'neutral-faded'
              }
            >
              {statusConfig.label}
            </Text>
          </div>

          {processStatusConfig && (
            <Tooltip
              text={
                profile.processStatus === 'erro'
                  ? profile.integration.errorMessage
                  : null
              }
            >
              {(props) => (
                <View {...props} direction="row" align="center" gap={2}>
                  <Text variant="body-3" color="neutral-faded">
                    Processamento:
                  </Text>
                  <Badge variant="outline" color={processStatusConfig.color}>
                    {processStatusConfig.label}
                  </Badge>
                </View>
              )}
            </Tooltip>
          )}
        </View>
      </div>

      <div className={styles.profileActions}>
        <Tooltip text="Ver Detalhes">
          {(props) => (
            <Button
              {...props}
              variant="outline"
              aria-label="Detalhes"
              onClick={() => onDetails(profile.id)}
            >
              <Icon name="file-text" size={18} />
            </Button>
          )}
        </Tooltip>

        <Tooltip text="Processar Campanhas">
          {(props) => (
            <Button
              {...props}
              variant="outline"
              aria-label="Processar"
              onClick={() => onProcess(profile.id)}
              loading={profile.processStatus === 'processando'}
            >
              <Icon name="player-play" size={18} />
            </Button>
          )}
        </Tooltip>

        <Tooltip text="Verificar Status">
          {(props) => (
            <Button
              {...props}
              variant="outline"
              aria-label="Verificar Status"
              onClick={() => onValidate(profile.id)}
            >
              <Icon name="refresh" size={18} />
            </Button>
          )}
        </Tooltip>

        <Button
          variant="outline"
          aria-label="Atualizar Token"
          onClick={() => onEdit(profile.integration)}
        >
          <Icon name="key" size={18} />
        </Button>

        <Button
          variant="outline"
          aria-label="Remover"
          color="critical"
          onClick={() => onDelete(profile.id)}
        >
          <Icon name="trash" size={18} />
        </Button>
      </div>
    </div>
  );
};
