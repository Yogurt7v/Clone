import axios from 'axios';
import {useUserStore} from "@/store/useUserStore";


export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const {accessToken, refreshToken} = useUserStore.getState();


    if (config.url?.includes('/auth/refresh')) {
        if (refreshToken) {
            config.headers.Authorization = `Bearer ${refreshToken}`;
        }
    } else {
        // Для всех остальных запросов используем accessToken
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;

});


    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const {response, config} = error

            if (response && response.status === 401 && !config._retry && !config.url?.includes('/auth/refresh')) {
                config._retry = true;
                const refreshToken = useUserStore.getState().refreshToken;
                if (refreshToken) {
                    try {
                        await useUserStore.getState().setRefreshToken();

                        const newAccessToken = useUserStore.getState().accessToken

                        if (!newAccessToken) {
                            throw new Error("Не удалось обновить accessToken");
                        }

                        // Повторяем запрос с новым токеном
                        config.headers.Authorization = `Bearer ${newAccessToken}`

                        return axiosInstance(config)
                    } catch (error) {
                        console.error("Ошибка при обновлении токена:", error);
                        useUserStore.getState().clearTokens()
                        return Promise.reject(error)
                    }
                }
            }
            return Promise.reject(error);
        }
    )
