import api from './api';

const getProducts = async (keyword = '', page = 1) => {
  const response = await api.get(`/products?keyword=${keyword}&page=${page}`);
  return response.data;
};

const productService = {
  getProducts,
};

export default productService;
