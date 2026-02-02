import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

let socket: Socket | null = null;

const getSocket = () => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    const backendUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export interface IntegrationUpdateData {
  integrationId: string;
  processStatus: string;
  errorMessage?: string;
}

export const useIntegrationRealTime = (
  integrationId: string | null,
  onUpdate: (data: IntegrationUpdateData) => void,
) => {
  useEffect(() => {
    if (!integrationId) return;

    const s = getSocket();
    if (!s) return;

    s.emit('join-integration', integrationId);

    s.on('processing-update', (data) => {
      if (data.integrationId === integrationId) {
        onUpdate(data);
      }
    });

    return () => {
      s.off('processing-update');
    };
  }, [integrationId, onUpdate]);
};

export const useProjectRealTime = (
  projectId: string | null,
  onUpdate: (data: IntegrationUpdateData) => void,
) => {
  useEffect(() => {
    if (!projectId) return;

    const s = getSocket();
    if (!s) return;

    s.emit('join-project', projectId);

    s.on('processing-update', (data) => {
      onUpdate(data);
    });

    return () => {
      s.off('processing-update');
    };
  }, [projectId, onUpdate]);
};
