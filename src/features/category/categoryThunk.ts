import { AppDispatch } from '@/store/store';
import {
  startLoadingCategories,
  setCategories,
  setCategoryError,
} from './categorySlice';
import { apiFetchCategories } from '@/utils/api/categories';

export const fetchCategoriesThunk = () => async (dispatch: AppDispatch) => {
  dispatch(startLoadingCategories());

  try {
    const categories = await apiFetchCategories(); // ✅ using axiosInstance
    dispatch(setCategories(categories));
  } catch (error) {
    console.error('[fetchCategoriesThunk]', error);
    dispatch(setCategoryError('Failed to fetch categories.'));
  }
};
