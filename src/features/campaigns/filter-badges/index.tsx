'use client';

import { Badge, Button, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { FilterBadgesProps } from './types';
import { getActiveFilters } from './utils';

export const FilterBadges = ({
  filters,
  onRemoveFilter,
  onClearAll,
}: FilterBadgesProps) => {
  const activeFilters = getActiveFilters(filters);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View direction="row" gap={2} align="center" className={styles.container}>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.value}-${filter.value || index}`}
          color="neutral"
          onDismiss={() => onRemoveFilter(filter.key, filter.value)}
          dismissAriaLabel={`Remover filtro ${filter.label}`}
        >
          {filter.label}
        </Badge>
      ))}
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="small"
          icon={<Icon name="x" size={14} />}
          onClick={onClearAll}
        >
          Limpar tudo
        </Button>
      )}
    </View>
  );
};
