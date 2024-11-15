const API_KEY = '843711dd34b74360ad926c8bf86b701e'; // Replace with your Spoonacular API key
const API_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;

const recipeList = document.getElementById('recipe-list');
const searchBtn = document.getElementById('search-btn');
const ingredientInput = document.getElementById('ingredient');

let favorites = [];

// Function to fetch recipes based on ingredient
async function fetchRecipes(ingredient) {
    try {
        const response = await fetch(`${API_URL}&query=${ingredient}`);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeList.innerHTML = '<p class="text-danger">Failed to fetch recipes. Please try again later.</p>';
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    recipeList.innerHTML = '';
    if (recipes.length === 0) {
        recipeList.innerHTML = '<p class="text-warning">No recipes found for the given ingredient.</p>';
        return;
    }

    recipes.forEach((recipe) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <button class="btn btn-primary btn-sm view-recipe" data-id="${recipe.id}">View Recipe</button>
                    <button class="btn btn-secondary btn-sm save-favorite" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">Save Favorite</button>
                </div>
            </div>
        `;
        recipeList.appendChild(col);
    });

    attachEventListeners();
}

// Function to fetch and display recipe details
async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
        const data = await response.json();

        const modalContent = `
            <h5>${data.title}</h5>
            <img src="${data.image}" class="img-fluid mb-3" alt="${data.title}">
            <p>${data.instructions || 'No instructions available.'}</p>
            <a href="${data.sourceUrl}" target="_blank" class="btn btn-primary">View Full Recipe</a>
        `;

        showModal('Recipe Details', modalContent);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

// Function to save a recipe to favorites
function saveFavorite(recipe) {
    if (!favorites.find((fav) => fav.id === recipe.id)) {
        favorites.push(recipe);
        alert('Recipe saved to favorites!');
    } else {
        alert('Recipe is already in favorites.');
    }
}

// Function to attach event listeners to buttons
function attachEventListeners() {
    document.querySelectorAll('.view-recipe').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            fetchRecipeDetails(id);
        });
    });

    document.querySelectorAll('.save-favorite').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const recipe = {
                id: e.target.getAttribute('data-id'),
                title: e.target.getAttribute('data-title'),
                image: e.target.getAttribute('data-image'),
            };
            saveFavorite(recipe);
        });
    });
}

// Function to show a modal
function showModal(title, content) {
    const modalHtml = `
        <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="recipeModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    modal.show();

    document.getElementById('recipeModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('recipeModal').remove();
    });
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
        fetchRecipes(ingredient);
    } else {
        alert('Please enter an ingredient!');
    }
});
