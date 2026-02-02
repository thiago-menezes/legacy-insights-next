export type UtmPlatform = 'meta_ads' | 'google_ads' | 'custom';

export interface UtmScriptConfig {
  platform: UtmPlatform;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  includeHotmartXcod?: boolean;
}

export interface GeneratedScript {
  html: string;
  url: string;
  instructions: string;
}

export interface UtmScriptsProps {
  projectId: string | number;
}
