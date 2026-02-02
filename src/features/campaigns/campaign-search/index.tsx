'use client';

import { useEffect, useState } from 'react';
import { TextField, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { CampaignSearchProps } from './types';

export const CampaignSearch = ({
  value,
  onChange,
  placeholder = 'Buscar campanhas...',
}: CampaignSearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when external value changes (e.g., clear filters)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <View width="300px">
      <TextField
        name="search"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.value)}
        startSlot={<Icon name="search" size={18} />}
      />
    </View>
  );
};
