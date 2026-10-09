import { getAllCategories, getAllProjectsOfCategory, getCategoryName, updateCategoryAssignments } from '../models/categories.js'
import { getProjectDetails, getAllCategoriesOfProject } from '../models/projects.js';

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const currentCategories = await getAllCategoriesOfProject(projectId);

    const title = "Assign Categories to Project";

    res.render('assign-categories', {projectId, projectDetails, categories, currentCategories, title});
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categories || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories Updated!');
    res.redirect(`/project/${projectId}`); 
};


export { showCategoriesPage, showCategoryDetais, showAssignCategoriesForm, processAssignCategoriesForm }