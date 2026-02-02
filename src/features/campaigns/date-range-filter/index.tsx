'use client';

import { Button, DropdownMenu } from 'reshaped';
import { Icon } from '@/components/icon';
import { DateOption, DateRangeFilterProps } from './types';

const DATE_OPTIONS: DateOption[] = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 90 dias', value: 90 },
];

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const selectedLabel =
    DATE_OPTIONS.find((opt) => opt.value === value)?.label || 'Últimos 90 dias';

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        {(attributes) => (
          <Button
            {...attributes}
            variant="outline"
            icon={<Icon name="calendar" size={18} />}
          >
            {selectedLabel}
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {DATE_OPTIONS.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
