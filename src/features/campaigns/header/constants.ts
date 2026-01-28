import { UseParamsCampaigns } from '../types';

export const PLATFORM_CONFIG: Record<
  UseParamsCampaigns['client'],
  { title: string; description: string; icon: string }
> = {
  meta: {
    title: 'Campanhas da Meta',
    description:
      ' Gestão de campanhas do Instagram, Facebook e outras ferramentas da Meta',
    icon: '/icon-meta.png',
  },
  google: {
    title: 'Campanhas do Google',
    description: 'Gestão de campanhas de pesquisa, display, Youtube e Shopping',
    icon: '/icon-google.png',
  },
};
