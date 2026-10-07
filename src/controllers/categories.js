import { getAllCategories, getAllProjectsOfCategory, getCategoryName } from '../models/categories.js'

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = "Categories";
    res.render('categories', { title, categories });
};

const showCategoryDetais = async (req, res) => {
    const categoryId = req.params.id;
    const projectsOfCategory = await getAllProjectsOfCategory(categoryId);
    const title = "Category Details";
    const categoryName = await getCategoryName(categoryId);

    res.render('category', { title, projectsOfCategory, categoryName });
};


export { showCategoriesPage, showCategoryDetais }