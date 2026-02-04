'use client';

import {
  Button,
  Checkbox,
  FormControl,
  Tabs,
  Text,
  TextField,
  View,
} from 'reshaped';
import { Icon } from '@/components/icon';
import { useUtmScripts } from './hooks';
import styles from './styles.module.scss';
import { UtmScriptsProps } from './types';

export const UtmScripts = (_props: UtmScriptsProps) => {
  const {
    selectedPlatform,
    setSelectedPlatform,
    includeHotmartXcod,
    setIncludeHotmartXcod,
    customConfig,
    setCustomConfig,
    handleCopy,
    getMetaAdsScript,
    getGoogleAdsScript,
    getCustomUtmUrl,
  } = useUtmScripts();

  const metaAdsScript = getMetaAdsScript();
  const googleAdsScript = getGoogleAdsScript();
  const customUtmUrl = getCustomUtmUrl();

  return (
    <View gap={4} paddingTop={6}>
      <Text variant="featured-2" weight="medium">
        Scripts de UTM
      </Text>
      <Text color="neutral-faded">
        Gere scripts de rastreamento UTM para suas campanhas de anúncios
      </Text>

      <Tabs
        value={selectedPlatform}
        onChange={(tab) => setSelectedPlatform(tab.value as never)}
      >
        <Tabs.List>
          <Tabs.Item value="meta_ads">
            <View direction="row" align="center" gap={2}>
              <Icon name="share-2" size={16} />
              Meta Ads
            </View>
          </Tabs.Item>
          <Tabs.Item value="google_ads">
            <View direction="row" align="center" gap={2}>
              <Icon name="globe" size={16} />
              Google Ads
            </View>
          </Tabs.Item>
          <Tabs.Item value="custom">
            <View direction="row" align="center" gap={2}>
              <Icon name="settings" size={16} />
              Personalizado
            </View>
          </Tabs.Item>
        </Tabs.List>
      </Tabs>

      {selectedPlatform === 'meta_ads' && (
        <div className={styles.scriptSection}>
          <View gap={3}>
            <Text variant="body-2" weight="medium">
              Parâmetros de URL para Meta Ads
            </Text>

            <div className={styles.scriptBlock}>
              <pre className={styles.scriptContent}>{metaAdsScript.html}</pre>
              <Button
                variant="ghost"
                size="small"
                icon={<Icon name="copy" />}
                onClick={() => handleCopy(metaAdsScript.html)}
                className={styles.copyButton}
              >
                Copiar
              </Button>
            </div>

            <div className={styles.instructionsBox}>
              <Text variant="caption-1" color="neutral-faded">
                {metaAdsScript.instructions}
              </Text>
            </div>

            <Checkbox
              checked={includeHotmartXcod}
              onChange={(e) => setIncludeHotmartXcod(e.checked)}
            >
              Adicionar xcod (Hotmart)
            </Checkbox>

            {includeHotmartXcod && (
              <div className={styles.instructionsBox}>
                <Text variant="caption-1" weight="medium">
                  Configuração Hotmart
                </Text>
                <Text variant="caption-1" color="neutral-faded">
                  Configure o parâmetro xcod nas configurações do produto
                  Hotmart para rastrear vendas vindas desta campanha.
                </Text>
              </div>
            )}
          </View>
        </div>
      )}

      {selectedPlatform === 'google_ads' && (
        <div className={styles.scriptSection}>
          <View gap={3}>
            <Text variant="body-2" weight="medium">
              Parâmetros de URL para Google Ads
            </Text>

            <div className={styles.scriptBlock}>
              <pre className={styles.scriptContent}>{googleAdsScript.html}</pre>
              <Button
                variant="ghost"
                size="small"
                icon={<Icon name="copy" />}
                onClick={() => handleCopy(googleAdsScript.html)}
                className={styles.copyButton}
              >
                Copiar
              </Button>
            </div>

            <div className={styles.instructionsBox}>
              <Text variant="caption-1">{googleAdsScript.instructions}</Text>
            </div>
          </View>
        </div>
      )}

      {selectedPlatform === 'custom' && (
        <div className={styles.scriptSection}>
          <View gap={3}>
            <Text variant="body-2" weight="medium">
              Construtor de UTM Personalizado
            </Text>

            <div className={styles.customFormGrid}>
              <FormControl>
                <FormControl.Label>UTM Source</FormControl.Label>
                <TextField
                  name="utmSource"
                  placeholder="Ex: facebook, google"
                  value={customConfig.utmSource}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, utmSource: e.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>UTM Medium</FormControl.Label>
                <TextField
                  name="utmMedium"
                  placeholder="Ex: cpc, social"
                  value={customConfig.utmMedium}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, utmMedium: e.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>UTM Campaign</FormControl.Label>
                <TextField
                  name="utmCampaign"
                  placeholder="Ex: summer_sale"
                  value={customConfig.utmCampaign}
                  onChange={(e) =>
                    setCustomConfig({
                      ...customConfig,
                      utmCampaign: e.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>UTM Content (Opcional)</FormControl.Label>
                <TextField
                  name="utmContent"
                  placeholder="Ex: banner_azul"
                  value={customConfig.utmContent || ''}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, utmContent: e.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>UTM Term (Opcional)</FormControl.Label>
                <TextField
                  name="utmTerm"
                  placeholder="Ex: running shoes"
                  value={customConfig.utmTerm || ''}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, utmTerm: e.value })
                  }
                />
              </FormControl>
            </div>

            {customUtmUrl && (
              <View gap={2}>
                <Text variant="body-2" weight="medium">
                  URL Gerada
                </Text>
                <div className={styles.previewUrl}>
                  <Text variant="caption-1">
                    https://seudominio.com?{customUtmUrl}
                  </Text>
                </div>
                <Button
                  variant="outline"
                  icon={<Icon name="copy" />}
                  onClick={() =>
                    handleCopy(`https://seudominio.com?${customUtmUrl}`)
                  }
                >
                  Copiar URL
                </Button>
              </View>
            )}
          </View>
        </div>
      )}
    </View>
  );
};
