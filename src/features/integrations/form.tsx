import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Select, TextField, View } from 'reshaped';
import {
  IntegrationCreateInput,
  IntegrationType,
  StrapiIntegration,
} from '@/libs/api/services/integrations';
import { INTEGRATION_TYPES } from './constants';
import { IntegrationFormProps } from './types';

const MASKED_TOKEN = '••••••••••••••••';

export const IntegrationForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  projectId,
}: IntegrationFormProps) => {
  const isEditMode = initialValues && 'documentId' in initialValues;

  const [accessTokenTouched, setAccessTokenTouched] = useState(false);
  const [refreshTokenTouched, setRefreshTokenTouched] = useState(false);
  const [clientSecretTouched, setClientSecretTouched] = useState(false);

  const { handleSubmit, setValue, watch, reset } =
    useForm<IntegrationCreateInput>({
      defaultValues: {
        name: initialValues?.name || '',
        type: initialValues?.type || 'meta_ads',
        project: projectId,
        status: (initialValues as StrapiIntegration)?.status || 'disconnected',
        config: (initialValues as StrapiIntegration)?.config || {},
      },
    });

  useEffect(() => {
    if (initialValues) {
      const isStrapi = 'documentId' in initialValues;
      const strapiData = initialValues as StrapiIntegration;
      const createData = initialValues as IntegrationCreateInput;
      reset({
        name: initialValues?.name || '',
        type: initialValues?.type || 'meta_ads',
        project: isStrapi
          ? strapiData.project?.documentId || projectId
          : createData.project || projectId,
        status: strapiData?.status || 'disconnected',
        accessToken: isStrapi ? MASKED_TOKEN : createData.accessToken || '',
        refreshToken: isStrapi ? MASKED_TOKEN : createData.refreshToken || '',
        config: strapiData?.config || {},
      });
      setAccessTokenTouched(false);
      setRefreshTokenTouched(false);
      setClientSecretTouched(false);
    }
  }, [initialValues, reset, projectId]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const typeValue = watch('type');
  const currentAccessToken = watch('accessToken');
  const currentRefreshToken = watch('refreshToken');

  const hasChanges = useMemo(() => {
    if (!isEditMode) return true;

    // Em modo de edição, só permitimos alterar tokens
    const accessTokenChanged =
      accessTokenTouched && currentAccessToken !== MASKED_TOKEN;
    const refreshTokenChanged =
      refreshTokenTouched && currentRefreshToken !== MASKED_TOKEN;
    const clientSecretChanged = clientSecretTouched;

    return accessTokenChanged || refreshTokenChanged || clientSecretChanged;
  }, [
    isEditMode,
    currentAccessToken,
    currentRefreshToken,
    accessTokenTouched,
    refreshTokenTouched,
    clientSecretTouched,
  ]);

  const handleFormSubmit = (values: IntegrationCreateInput) => {
    const payload = { ...values };

    if (isEditMode) {
      if (!accessTokenTouched || payload.accessToken === MASKED_TOKEN) {
        delete payload.accessToken;
      }
      if (!refreshTokenTouched || payload.refreshToken === MASKED_TOKEN) {
        delete payload.refreshToken;
      }
      if (!clientSecretTouched) {
        if (payload.config) {
          delete payload.config.clientSecret;
        }
      }
    }

    onSubmit(payload);
  };

  const handleAccessTokenChange = (value: string) => {
    if (!accessTokenTouched) {
      setAccessTokenTouched(true);
      setValue('accessToken', value === MASKED_TOKEN ? '' : value);
    } else {
      setValue('accessToken', value);
    }
  };

  const handleRefreshTokenChange = (value: string) => {
    if (!refreshTokenTouched) {
      setRefreshTokenTouched(true);
      setValue('refreshToken', value === MASKED_TOKEN ? '' : value);
    } else {
      setValue('refreshToken', value);
    }
  };

  const handleClientSecretChange = (value: string) => {
    if (!clientSecretTouched) {
      setClientSecretTouched(true);
      setValue('config.clientSecret', value === MASKED_TOKEN ? '' : value);
    } else {
      setValue('config.clientSecret', value);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <View gap={4} paddingTop={4}>
        <FormControl>
          <FormControl.Label>Nome da Integração</FormControl.Label>
          <TextField
            placeholder="Ex: Minha Conta de Anúncios"
            name="name"
            value={watch('name') || ''}
            onChange={(e) => setValue('name', e.value)}
            disabled={isEditMode}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Tipo de Integração</FormControl.Label>
          <Select
            name="type"
            options={INTEGRATION_TYPES}
            value={typeValue}
            onChange={(e) => setValue('type', e.value as IntegrationType)}
            disabled={isEditMode}
          />
        </FormControl>

        {typeValue === 'meta_ads' && (
          <View gap={4}>
            <FormControl>
              <FormControl.Label>Access Token</FormControl.Label>
              <TextField
                placeholder="EAAL..."
                name="accessToken"
                value={currentAccessToken || ''}
                onChange={(e) => handleAccessTokenChange(e.value)}
                onFocus={() => {
                  if (isEditMode && !accessTokenTouched) {
                    setAccessTokenTouched(true);
                    setValue('accessToken', '');
                  }
                }}
              />
              {isEditMode && !accessTokenTouched && (
                <FormControl.Helper>
                  Clique no campo para inserir um novo token
                </FormControl.Helper>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>App ID</FormControl.Label>
              <TextField
                placeholder="Ex: 8290..."
                name="config.appId"
                value={(watch('config.appId') as string) || ''}
                onChange={(e) => setValue('config.appId', e.value)}
                disabled={isEditMode}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>App Secret</FormControl.Label>
              <TextField
                placeholder="Ex: a1b2..."
                name="config.appSecret"
                value={(watch('config.appSecret') as string) || ''}
                onChange={(e) => setValue('config.appSecret', e.value)}
                inputAttributes={{ type: 'password' }}
                disabled={isEditMode}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                Lista AccountIDs (Separados por vírgula)
              </FormControl.Label>
              <TextField
                name="config.adAccountIds"
                inputAttributes={{ autoComplete: 'off' }}
                placeholder="Ex: act_123, act_456"
                value={(
                  watch('config.adAccountIds') as string[] | undefined
                )?.join(', ')}
                onChange={(e) => {
                  const ids = e.value
                    .split(',')
                    .map((id) => id.trim())
                    .filter(Boolean);
                  setValue('config.adAccountIds', ids);
                }}
                disabled={isEditMode}
              />
            </FormControl>
          </View>
        )}

        {typeValue === 'google_ads' && (
          <View gap={4}>
            <FormControl>
              <FormControl.Label>Client ID</FormControl.Label>
              <TextField
                placeholder="Ex: 8761..."
                name="config.clientId"
                value={(watch('config.clientId') as string) || ''}
                onChange={(e) => setValue('config.clientId', e.value)}
                disabled={isEditMode}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Client Secret</FormControl.Label>
              <TextField
                placeholder="Ex: GOCSPX-..."
                name="config.clientSecret"
                value={
                  isEditMode && !clientSecretTouched
                    ? MASKED_TOKEN
                    : (watch('config.clientSecret') as string) || ''
                }
                onChange={(e) => handleClientSecretChange(e.value)}
                onFocus={() => {
                  if (isEditMode && !clientSecretTouched) {
                    setClientSecretTouched(true);
                    setValue('config.clientSecret', '');
                  }
                }}
              />
              {isEditMode && !clientSecretTouched && (
                <FormControl.Helper>
                  Clique no campo para inserir um novo secret
                </FormControl.Helper>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>Refresh Token</FormControl.Label>
              <TextField
                placeholder="Ex: 1//0..."
                name="refreshToken"
                value={currentRefreshToken || ''}
                onChange={(e) => handleRefreshTokenChange(e.value)}
                onFocus={() => {
                  if (isEditMode && !refreshTokenTouched) {
                    setRefreshTokenTouched(true);
                    setValue('refreshToken', '');
                  }
                }}
              />
              {isEditMode && !refreshTokenTouched && (
                <FormControl.Helper>
                  Clique no campo para inserir um novo token
                </FormControl.Helper>
              )}
            </FormControl>
            <FormControl>
              <FormControl.Label>Developer Token</FormControl.Label>
              <TextField
                placeholder="Ex: DvD3..."
                name="config.developerToken"
                value={(watch('config.developerToken') as string) || ''}
                onChange={(e) => setValue('config.developerToken', e.value)}
                disabled={isEditMode}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                Customer IDs (Separados por vírgula)
              </FormControl.Label>
              <TextField
                name="config.customerIds"
                placeholder="Ex: 5559111179, 6421607101"
                value={
                  (watch('config.customerIds') as string[] | undefined)?.join(
                    ', ',
                  ) || ''
                }
                onChange={(e) => {
                  const ids = e.value
                    .split(',')
                    .map((id) => id.trim())
                    .filter(Boolean);
                  setValue('config.customerIds', ids);
                }}
                disabled={isEditMode}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Login Customer ID (MCC)</FormControl.Label>
              <TextField
                placeholder="Ex: 3127..."
                name="config.loginCustomerId"
                value={(watch('config.loginCustomerId') as string) || ''}
                onChange={(e) => setValue('config.loginCustomerId', e.value)}
                disabled={isEditMode}
              />
              <FormControl.Helper>
                Necessário se você estiver acessando contas via MCC
              </FormControl.Helper>
            </FormControl>
          </View>
        )}

        <View direction="row" gap={3} justify="end" paddingTop={4}>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            color="primary"
            loading={isLoading}
            disabled={isLoading || !hasChanges}
          >
            {isEditMode ? 'Atualizar Token' : 'Conectar'}
          </Button>
        </View>
      </View>
    </form>
  );
};
