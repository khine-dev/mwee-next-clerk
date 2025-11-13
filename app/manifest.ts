import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mwee',
        short_name: 'mwee',
        description: 'A minimal chat app by Khine',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon.svg',
                sizes: '192x192',
                type: 'image/svg',
            },
            {
                src: '/icon.svg',
                sizes: '512x512',
                type: 'image/svg',
            },
        ],
    }
}
