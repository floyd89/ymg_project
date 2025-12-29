
import { Product } from './types';

export const products: Product[] = [
  {
    id: 'urban-explorer-backpack',
    name: 'Urban Explorer Backpack',
    category: 'Backpack',
    price: 'Rp 450.000',
    shortDescription: 'Ransel serbaguna dengan desain modern untuk aktivitas harian dan perjalanan.',
    fullDescription: 'Didesain untuk petualang kota, Urban Explorer Backpack memadukan gaya dan fungsi. Dengan kompartemen laptop empuk dan banyak saku, tas ini siap menemani semua kesibukan Anda dari kantor hingga akhir pekan.',
    highlights: [
      'Bahan Kanvas Tahan Air',
      'Kompartemen Laptop hingga 15"',
      'Port Pengisian USB Eksternal',
      'Bantalan Punggung Ergonomis',
    ],
    imageUrl: 'https://picsum.photos/seed/backpack-black/800/600',
    variants: [
      { id: 'ueb-black', colorName: 'Hitam Arang', colorHex: '#333333', imageUrl: 'https://picsum.photos/seed/backpack-black/800/600' },
      { id: 'ueb-navy', colorName: 'Biru Dongker', colorHex: '#1E3A8A', imageUrl: 'https://picsum.photos/seed/backpack-navy/800/600' },
      { id: 'ueb-grey', colorName: 'Abu-abu Batu', colorHex: '#A0AEC0', imageUrl: 'https://picsum.photos/seed/backpack-grey/800/600' },
    ]
  },
  {
    id: 'classic-leather-tote',
    name: 'Classic Leather Tote',
    category: 'Tote Bag',
    price: 'Rp 650.000',
    shortDescription: 'Tas jinjing kulit klasik yang elegan untuk tampilan profesional.',
    fullDescription: 'Tingkatkan gaya Anda dengan Classic Leather Tote. Dibuat dari kulit sintetis premium, tas ini memiliki interior yang luas untuk membawa semua kebutuhan esensial Anda dengan gaya yang tak lekang oleh waktu.',
    highlights: [
      'Kulit Sintetis Kualitas Premium',
      'Interior Luas dengan Saku Ritsleting',
      'Tali Bahu yang Nyaman',
      'Desain Abadi dan Profesional',
    ],
    imageUrl: 'https://picsum.photos/seed/tote-cognac/800/600',
    variants: [
      { id: 'clt-cognac', colorName: 'Coklat Cognac', colorHex: '#9F582A', imageUrl: 'https://picsum.photos/seed/tote-cognac/800/600' },
      { id: 'clt-black', colorName: 'Hitam Klasik', colorHex: '#1A1A1A', imageUrl: 'https://picsum.photos/seed/tote-black/800/600' },
    ]
  },
  {
    id: 'nomad-sling-bag',
    name: 'Nomad Sling Bag',
    category: 'Sling Bag',
    price: 'Rp 280.000',
    shortDescription: 'Tas selempang ringkas dan praktis untuk membawa barang-barang penting.',
    fullDescription: 'Untuk hari-hari saat Anda hanya perlu membawa yang terpenting. Nomad Sling Bag menawarkan kenyamanan dan akses cepat ke barang-barang Anda tanpa mengorbankan gaya. Sempurna untuk jalan-jalan atau konser.',
    highlights: [
      'Desain Ringkas dan Ringan',
      'Bahan Nilon Tahan Lama',
      'Beberapa Kompartemen Terorganisir',
      'Tali yang Dapat Disesuaikan',
    ],
    imageUrl: 'https://picsum.photos/seed/sling-olive/800/600',
    variants: [
      { id: 'nsb-olive', colorName: 'Hijau Zaitun', colorHex: '#556B2F', imageUrl: 'https://picsum.photos/seed/sling-olive/800/600' },
      { id: 'nsb-charcoal', colorName: 'Abu Arang', colorHex: '#4A4A4A', imageUrl: 'https://picsum.photos/seed/sling-charcoal/800/600' },
      { id: 'nsb-khaki', colorName: 'Krem Khaki', colorHex: '#C3B091', imageUrl: 'https://picsum.photos/seed/sling-khaki/800/600' },
    ]
  },
  {
    id: 'voyager-duffle-bag',
    name: 'Voyager Duffle Bag',
    category: 'Travel',
    price: 'Rp 550.000',
    shortDescription: 'Tas travel andal untuk perjalanan akhir pekan atau ke gym.',
    fullDescription: 'Siap untuk petualangan apa pun, Voyager Duffle Bag menawarkan ruang yang sangat luas dalam desain yang tangguh. Dilengkapi dengan kompartemen sepatu terpisah dan tali bahu yang bisa dilepas.',
    highlights: [
      'Kapasitas Besar 40L',
      'Kompartemen Sepatu Berventilasi',
      'Bahan Tahan Sobekan',
      'Serbaguna untuk Travel & Olahraga',
    ],
    imageUrl: 'https://picsum.photos/seed/duffle-graphite/800/600',
    variants: [
      { id: 'vdb-graphite', colorName: 'Graphite', colorHex: '#555555', imageUrl: 'https://picsum.photos/seed/duffle-graphite/800/600' },
      { id: 'vdb-red', colorName: 'Merah Bata', colorHex: '#B85C5C', imageUrl: 'https://picsum.photos/seed/duffle-red/800/600' },
    ]
  },
  {
    id: 'minimalist-crossbody',
    name: 'Minimalist Crossbody',
    category: 'Sling Bag',
    price: 'Rp 320.000',
    shortDescription: 'Tas selempang wanita dengan desain bersih dan sentuhan mewah.',
    fullDescription: 'Sederhana namun menawan, Minimalist Crossbody adalah aksesori yang sempurna untuk melengkapi pakaian apa pun. Ukurannya yang pas cukup untuk ponsel, dompet, dan kunci, menjadikannya pilihan ideal untuk siang dan malam.',
    highlights: [
      'Desain Struktural yang Rapi',
      'Aksen Logam Emas',
      'Penutup Magnetik yang Aman',
      'Tali Rantai yang Dapat Dilepas',
    ],
    imageUrl: 'https://picsum.photos/seed/crossbody-blush/800/600',
    variants: [
      { id: 'mcb-blush', colorName: 'Merah Muda', colorHex: '#D8AFAF', imageUrl: 'https://picsum.photos/seed/crossbody-blush/800/600' },
      { id: 'mcb-taupe', colorName: 'Coklat Abu', colorHex: '#8B8589', imageUrl: 'https://picsum.photos/seed/crossbody-taupe/800/600' },
      { id: 'mcb-cream', colorName: 'Krem', colorHex: '#F5F5DC', imageUrl: 'https://picsum.photos/seed/crossbody-cream/800/600' },
    ]
  },
  {
    id: 'tech-commuter-briefcase',
    name: 'Tech Commuter Briefcase',
    category: 'Backpack',
    price: 'Rp 750.000',
    shortDescription: 'Tas kerja modern 3-in-1: ransel, selempang, dan tas jinjing.',
    fullDescription: 'Tas paling adaptif untuk profesional modern. Tech Commuter Briefcase dapat diubah dari ransel menjadi tas selempang atau tas jinjing dalam sekejap. Dirancang untuk melindungi perangkat teknologi Anda dengan gaya.',
    highlights: [
      'Konvertibel 3-in-1',
      'Kompartemen Teknologi Tahan Guncangan',
      'Desain Tahan Percikan Air',
      'Sistem Saku Cerdas',
    ],
    imageUrl: 'https://picsum.photos/seed/briefcase-jetblack/800/600',
    variants: [
      { id: 'tcb-jetblack', colorName: 'Hitam Pekat', colorHex: '#0A0A0A', imageUrl: 'https://picsum.photos/seed/briefcase-jetblack/800/600' },
      { id: 'tcb-steel', colorName: 'Baja', colorHex: '#71797E', imageUrl: 'https://picsum.photos/seed/briefcase-steel/800/600' },
    ]
  }
];
