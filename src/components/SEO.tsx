import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = 'AfiliadoBot - Gestão Inteligente de Afiliados',
    description = 'Plataforma completa para gerenciar produtos de afiliados, automatizar envios no Telegram e maximizar suas conversões.',
    keywords = 'afiliados, shopee, aliexpress, telegram bot, automação, gestão de produtos',
    image = '/og-image.png',
    url = 'https://afiliado.top'
}) => {
    useEffect(() => {
        const siteName = 'AfiliadoBot';
        const fullTitle = title.includes('AfiliadoBot') ? title : `${title} | ${siteName}`;

        // Set document title
        document.title = fullTitle;

        // Update or create meta tags
        const updateMeta = (name: string, content: string, isProperty = false) => {
            const attr = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // Primary Meta Tags
        updateMeta('description', description);
        updateMeta('keywords', keywords);

        // Open Graph
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', description, true);
        updateMeta('og:image', image, true);
        updateMeta('og:url', url, true);
        updateMeta('og:site_name', siteName, true);

        // Twitter
        updateMeta('twitter:title', fullTitle, true);
        updateMeta('twitter:description', description, true);
        updateMeta('twitter:image', image, true);
        updateMeta('twitter:card', 'summary_large_image', true);

    }, [title, description, keywords, image, url]);

    return null;
};
