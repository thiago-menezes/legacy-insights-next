import React, { useState } from 'react';
import { Button, Modal, Text, TextField, View } from 'reshaped';

interface DeleteModalProps {
  active: boolean;
  onClose: () => void;
  onConfirm: () => void;
  integrationName: string;
}

export const DeleteModal = ({
  active,
  onClose,
  onConfirm,
  integrationName,
}: DeleteModalProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (inputValue === integrationName) {
      onConfirm();
    }
  };

  const isConfirmDisabled = inputValue !== integrationName;

  return (
    <Modal active={active} onClose={onClose}>
      <Modal.Title>Excluir Integração</Modal.Title>
      <View gap={4} paddingTop={4}>
        <Text variant="body-2" color="critical">
          Tem certeza que deseja excluir a integração {integrationName}? Esta
          ação é irreversível e excluirá todos os dados associados a esta
          integração.
        </Text>

        <Text variant="body-2">
          Para confirmar, digite <strong>{integrationName}</strong> no campo
          abaixo:
        </Text>

        <TextField
          name="confirmationInput"
          placeholder={integrationName}
          value={inputValue}
          onChange={({ value }) => setInputValue(value)}
        />

        <View direction="row" gap={2} justify="end" paddingTop={4}>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            color="critical"
            disabled={isConfirmDisabled}
          >
            Excluir permanentemente
          </Button>
        </View>
      </View>
    </Modal>
  );
};
