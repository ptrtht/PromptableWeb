export const getLocalDateTime = (date: Date | string) => {
  const d = new Date(date);

  const padDate = (n: number) => (n < 10 ? `0${n}` : n);

  //   just format it to YYYY/MM/DD HH:mm
  return `${d.getFullYear()}/${padDate(d.getMonth() + 1)}/${padDate(d.getDate())} ${d.getHours()}:${d.getMinutes()}`;
};
