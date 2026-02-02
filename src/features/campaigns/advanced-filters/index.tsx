'use client';

import { useState } from 'react';
import { Button, Checkbox, FormControl, Modal, View } from 'reshaped';
import { STATUS_OPTIONS } from './constants';
import {
  AdvancedFiltersProps,
  AdvancedFiltersState,
  CampaignStatus,
} from './types';

export const AdvancedFilters = ({
  active,
  onClose,
  onApply,
  currentFilters,
}: AdvancedFiltersProps) => {
  const getInitialFilters = () => currentFilters;
  const [filters, setFilters] =
    useState<AdvancedFiltersState>(getInitialFilters());

  const handleStatusToggle = (status: CampaignStatus) => {
    setFilters((prev) => {
      const currentStatus = prev.status || [];
      const newStatus = currentStatus.includes(status)
        ? currentStatus.filter((s) => s !== status)
        : [...currentStatus, status];

      return {
        ...prev,
        status: newStatus.length > 0 ? newStatus : undefined,
      };
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClose = () => {
    setFilters(currentFilters);
    onClose();
  };

  return (
    <Modal active={active} onClose={handleClose}>
      <Modal.Title>Filtros Avançados</Modal.Title>
      <View gap={4} paddingTop={4} paddingBottom={4}>
        <FormControl>
          <FormControl.Label>Status da Campanha</FormControl.Label>
          <View gap={2}>
            {STATUS_OPTIONS.map((option) => (
              <Checkbox
                key={option.value}
                name={`status-${option.value}`}
                checked={filters.status?.includes(option.value) || false}
                onChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </Checkbox>
            ))}
          </View>
        </FormControl>
      </View>

      <View gap={3} direction="row" justify="end">
        <Button onClick={handleClose}>Cancelar</Button>
        <Button color="primary" onClick={handleApply}>
          Aplicar Filtros
        </Button>
      </View>
    </Modal>
  );
};
