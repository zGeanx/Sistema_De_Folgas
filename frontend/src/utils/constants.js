export const DIAS_SEMANA = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

export const TURNOS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

export const STATUS = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  recusada: 'Recusada',
};

export const DIAS_ARRAY = Object.keys(DIAS_SEMANA);
export const TURNOS_ARRAY = Object.keys(TURNOS);
export const STATUS_ARRAY = Object.keys(STATUS);
export const API_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  REFRESH_TOKEN: '/auth/token/refresh/',
  USER_PROFILE: '/auth/me/',
  SOLICITACOES: '/solicitacoes/',
  MINHAS_FOLGAS: '/solicitacoes/minhas_folgas/',
  ESTATISTICAS: '/solicitacoes/estatisticas/',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};
