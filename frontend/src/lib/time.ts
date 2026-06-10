export const relativeTime = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  const ahora = new Date();

  const diffMs = ahora.getTime() - fecha.getTime();

  const minutos = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutos < 1) {
    return 'segundos';
  }

  if (minutos < 60) {
    return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  }

  if (horas < 24) {
    return `${horas} hora${horas !== 1 ? 's' : ''}`;
  }

  return `${dias} día${dias !== 1 ? 's' : ''}`;
};

export const dayTime = (datetime: string) => {
  const date = new Date(datetime);
  return date
    .toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toLowerCase();
};
