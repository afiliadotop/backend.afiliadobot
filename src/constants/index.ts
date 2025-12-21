/**
 * Application-wide constants
 */

export const MESSAGES = {
    // Success messages
    PRODUCT_CREATED: 'Produto criado com sucesso!',
    PRODUCT_UPDATED: 'Produto atualizado com sucesso!',
    PRODUCT_DELETED: 'Produto deletado com sucesso!',
    LOGIN_SUCCESS: 'Bem-vindo de volta!',
    LOGOUT_SUCCESS: 'Até logo!',

    // Error messages
    ERROR_GENERIC: 'Ocorreu um erro. Tente novamente.',
    ERROR_NETWORK: 'Erro de conexão com o servidor',
    ERROR_UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
    ERROR_FORBIDDEN: 'Você não tem permissão para esta ação',
    ERROR_NOT_FOUND: 'Recurso não encontrado',
    ERROR_VALIDATION: 'Verifique os dados e tente novamente',

    // Validation
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_MIN_LENGTH: 'Senha deve ter no mínimo 6 caracteres',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
    },
    PRODUCTS: {
        LIST: '/products',
        CREATE: '/products',
        UPDATE: (id: number | string) => `/products/${id}`,
        DELETE: (id: number | string) => `/products/${id}`,
    },
    STATS: {
        DASHBOARD: '/stats/dashboard',
    },
} as const;

export const STORAGE_KEYS = {
    USER: 'afiliadobot_user',
    TOKEN: 'afiliadobot_token',
    THEME: 'theme',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PRODUCTS: '/dashboard/products',
    CLIENT: '/client',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const;
