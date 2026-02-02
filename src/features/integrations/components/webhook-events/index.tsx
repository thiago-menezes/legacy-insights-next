'use client';

import { Loader, Pagination, Select, Text, View } from 'reshaped';
import { EventDetail } from './event-detail';
import { useWebhookEvents } from './hooks';
import styles from './styles.module.scss';
import { WebhookEventsProps } from './types';

export const WebhookEvents = ({ integrationId }: WebhookEventsProps) => {
  const {
    data,
    isLoading,
    selectedEvent,
    isDetailModalOpen,
    eventTypeFilter,
    setEventTypeFilter,
    page,
    handleEventClick,
    handleCloseDetail,
    handlePageChange,
    formatDate,
    formatCurrency,
  } = useWebhookEvents(integrationId);

  if (isLoading) {
    return (
      <View align="center" justify="center" padding={10}>
        <Loader />
      </View>
    );
  }

  const events = data?.data || [];
  const pagination = data?.meta?.pagination;

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Text variant="body-1" color="neutral-faded">
          Nenhum evento de webhook registrado ainda
        </Text>
        <Text variant="caption-1" color="neutral-faded">
          Os eventos aparecerão aqui quando recebermos notificações do webhook
        </Text>
      </div>
    );
  }

  // Get unique event types for filter
  const eventTypes = [...new Set(events.map((e) => e.eventType))];

  return (
    <div className={styles.container}>
      <View gap={4}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="featured-2" weight="medium">
            Eventos de Webhook
          </Text>

          {eventTypes.length > 1 && (
            <View width="200px">
              <Select
                name="eventTypeFilter"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.value)}
              >
                <option value="">Todos os Tipos</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </View>
          )}
        </View>

        <table className={styles.eventsTable}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Data/Hora</th>
              <th className={styles.tableHeaderCell}>Tipo de Evento</th>
              <th className={styles.tableHeaderCell}>Valor</th>
              <th className={styles.tableHeaderCell}>UTM Campaign</th>
              <th className={styles.tableHeaderCell}>Produto</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.documentId}
                className={styles.tableRow}
                onClick={() => handleEventClick(event)}
              >
                <td className={styles.tableCell}>
                  {formatDate(event.processedAt)}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.eventTypeBadge}>
                    {event.eventType}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {formatCurrency(event.amount)}
                </td>
                <td className={styles.tableCell}>{event.utmCampaign || '-'}</td>
                <td className={styles.tableCell}>
                  {event.product?.name || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination && pagination.pageCount > 1 && (
          <View align="center" paddingTop={4}>
            <Pagination
              total={pagination.pageCount}
              page={page}
              onChange={({ page: newPage }) => handlePageChange(newPage)}
              previousAriaLabel="Página anterior"
              nextAriaLabel="Próxima página"
            />
          </View>
        )}
      </View>

      <EventDetail
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};
