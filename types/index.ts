export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
}

export interface TouristSpot {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
    latitude?: number | null;
    longitude?: number | null;
    price?: number | null;
    schedule?: string | null;
    categories: Category[];
    rating ?: number | null;
    reviewCount ?: number | null;
}

export interface Meta {
    total: number;
    currentPage: number;
    lastPage: number;
    limit: number;
}

export interface Review {
    id: number;
    rating: number;
    comment: string;
    spotId: number;
}

