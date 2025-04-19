import { axiosInstance } from '@/services/axiosInstance';
import { IFetchedProfile, IUserLogin, IUserRegister } from '@/types/user';
import { redirect } from 'next/navigation';


export const getAllUsers = async () => {
  const response = (await axiosInstance.get('/user')).data;
  return response;
}

export const getUserProfile = async (id: number): Promise<IFetchedProfile> => {
  const response = (await axiosInstance.get(`/user/profile/${id}`)).data;
  return response;
};

export const updateUserProfilePost = async (id: number | undefined, user: IFetchedProfile): Promise<IFetchedProfile> => {
  if (!id) {
    throw new Error('ID пользователя не указан');
  }

  const response = (await axiosInstance.post(`/user/profile/${id}`, {
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl
  })).data;

  return response;
};

export const deleteUserProfile = async (id: number) => {
  return (await axiosInstance.delete(`/user/profile/${id}`)).data;
};

export const register = async (user: IUserRegister) => {
  const response = (await axiosInstance.post('/auth/register', user)).data;
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
};

export const login = async (user: IUserLogin) => {
  const response = (await axiosInstance.post('/auth/login', user)).data;
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
};

export const refreshToken = async () => {
  const refreshTokenFromStorage = localStorage.getItem('refreshToken');
  if (!refreshTokenFromStorage) {
    throw new Error('Токен обновления отсутствует');
    redirect('/login')
  }

  return (await axiosInstance.post('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${refreshTokenFromStorage}`,
    }
  })).data;
}

export const logout = async (id: number | undefined) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Токен авторизации отсутствует');
  }

  return (await axiosInstance.post('/auth/signout', { id }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })).data;
}


export const loginWithGoogle = () => {
  // 1. Открываем новое окно/вкладку с URL бэкенда
  const authWindow = window.open(
    'http://localhost:4000/auth/google/login',
    '_blank',
    'width=500,height=600'
  );

  // 2. Опционально: слушаем сообщения от бэкенда (если используется postMessage)
  window.addEventListener('message', (event) => {
    if (event.origin === 'http://localhost:4000' && event.data.token) {
      console.log('Received message:', event.data);

      localStorage.setItem('accessToken', event.data.token);
      localStorage.setItem('user', JSON.stringify({ id: event.data.userId }));
      localStorage.setItem('refreshToken', event.data.refreshToken);
      authWindow?.close();

      window.removeEventListener('message', loginWithGoogle);

      window.location.href = '/';
    }
  });

  window.addEventListener('message', loginWithGoogle);
};