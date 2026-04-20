export const respond = (data = {}, status = 200) => {
  return {
    status,
    data,
    timestamp: Date.now()
  };
};

