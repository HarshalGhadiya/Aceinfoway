import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getProductPerformance } from '../services/productService.js';

export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getProductPerformance(id);
  res.json(result);
});
