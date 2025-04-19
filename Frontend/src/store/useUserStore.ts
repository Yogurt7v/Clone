

import { create } from 'zustand';
import { IFetchedProfile, IUserRegister } from '@/types/user';
import { Api } from '@/services/api-client';
import { IFormLogin } from '@/lib/formValidation';
import { updateUserProfilePost } from '@/services/user';
import toast from 'react-hot-toast';

interface IUserStore {
    user: { id: number | undefined } | null;
    role: string | null;
    accessToken: string;
    refreshToken: string;
    loading: boolean;
    error: null;
    register: (user: IUserRegister) => Promise<void>;
    login: (user: IFormLogin) => Promise<void>;
    logout: (id: number | undefined) => Promise<void>; // Changed to require number
    setRefreshToken: () => Promise<void>;
    clearTokens: () => void;
    updateProfile: (profile: IFetchedProfile) => Promise<void>;
}

export const useUserStore = create<IUserStore>()(
    (set, get) => ({
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
        role: null,
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        loading: false,
        error: null,

        register: async (user: IUserRegister) => {
            set({ loading: true });

            try {
                const res = await Api.user.register(user);
                set({
                    user: { id: res.id },
                    role: res.role,
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loading: false,
                    error: null,
                });
                localStorage.setItem('user', JSON.stringify({ id: res.id }));
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                toast.success('Успешная регистрация!');
            } catch (error: unknown) {
                set({ loading: false });

                if (error instanceof Error) {
                    toast.error(error.message);
                    console.error(error.message);
                } else if (typeof error === 'object' && error !== null && 'response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    toast.error(err.response?.data?.message || 'Ошибка при регистрации');
                    console.error(err.response?.data?.message);
                } else {
                    toast.error('Неизвестная ошибка');
                    console.error(error);
                }

                throw error;
            }
        },

        login: async (user: IFormLogin) => {
            set({ loading: true });
            try {
                const res = await Api.user.login(user);
                set({
                    user: { id: res.id },
                    role: res.role,
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loading: false,
                    error: null,
                });
                localStorage.setItem('user', JSON.stringify({ id: res.id }));
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                toast.success(res.message);
            } catch (error: unknown) {
                set({ loading: false });

                if (error instanceof Error) {
                    toast.error(error.message);
                    console.error(error.message);
                } else if (typeof error === 'object' && error !== null && 'response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    toast.error(err.response?.data?.message || 'Ошибка при входе');
                    console.error(err.response?.data?.message);
                } else {
                    toast.error('Неизвестная ошибка');
                    console.error(error);
                }

                throw error;
            }
        },

        logout: async (id: number | undefined) => { // Changed parameter to required number
            set({ loading: true });
            try {
                try {
                    await get().setRefreshToken();
                } catch (refreshError) {
                    console.error('Ошибка при обновлении токена:', refreshError);
                }

                const res = await Api.user.logout(id);

                set({
                    accessToken: '',
                    refreshToken: '',
                    user: null,
                    role: null,
                    loading: false,
                    error: null,
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                toast.success(res.message);
            } catch (error: unknown) {
                set({ loading: false });

                if (error instanceof Error) {
                    toast.error(error.message);
                    console.error(error.message);
                } else if (typeof error === 'object' && error !== null && 'response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    toast.error(err.response?.data?.message || 'Ошибка при выходе');
                    console.error(err.response?.data?.message);
                } else {
                    toast.error('Неизвестная ошибка');
                    console.error(error);
                }

                throw error;
            }
        },

        setRefreshToken: async () => {
            try {
                const refreshTokenFromStorage = localStorage.getItem('refreshToken');
                if (!refreshTokenFromStorage) {
                    throw new Error('Токен обновления отсутствует');
                }

                const res = await Api.user.refreshToken();

                set({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                });

                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
            } catch (error: unknown) {
                set({ accessToken: '', refreshToken: '' });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                if (error instanceof Error) {
                    toast.error(error.message);
                    console.error(error.message);
                } else {
                    toast.error('Ошибка при обновлении токена');
                    console.error(error);
                }

                throw error;
            }
        },

        clearTokens: () => {
            set({
                accessToken: '',
                refreshToken: '',
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },

        updateProfile: async (profile: IFetchedProfile) => {
            set({ loading: true });
            try {
                const currentUser = get().user;
                if (!currentUser) {
                    toast.error('Пользователь не авторизован');
                    set({ loading: false });
                    return;
                }

                const updatedProfile = await updateUserProfilePost(currentUser.id, profile);
                console.log('update:', updatedProfile);

                set({
                    user: { ...currentUser, id: updatedProfile.id },
                    loading: false,
                });

                toast.success('Профиль обновлен успешно!');
            } catch (error: unknown) {
                set({ loading: false });

                if (error instanceof Error) {
                    toast.error(error.message);
                    console.error(error.message);
                } else if (typeof error === 'object' && error !== null && 'response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    toast.error(err.response?.data?.message || 'Ошибка при обновлении профиля');
                    console.error(err.response?.data?.message);
                } else {
                    toast.error('Неизвестная ошибка');
                    console.error(error);
                }
            }
        },
        initialize: () => {
            const user = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            if (user && accessToken) {
              set({ user: JSON.parse(user) });
            }
          }
    }),
);