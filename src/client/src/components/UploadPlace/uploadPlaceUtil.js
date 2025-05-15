export const mapCategoriesOptions = (categories) => {

    const options = categories.map(category => ({
        value: category.id,
        label: category.name,
        children: category.subcategories.map(child => ({
            value: child.id,
            label: child.name,
        })),
    }));

    return options;

};

export const mapCountryOptions = (countries) => {

    const options = countries.map(country => ({
        value: country.id,
        label: country.name,
    }));

    return options;
};

export const generateFormData = (data) => {

    const formData = new FormData();

    formData.append("Name", data.Name ?? "");
    formData.append("Address", data.Address ?? "");
    formData.append("Description", data.Description);
    formData.append("CategoryId", data.CategoryId[0]);
    formData.append("SubcategoryId", data.CategoryId[1]);
    formData.append("CountryId", data.CountryId);
    formData.append("ReviewRating", data.Rating);
    formData.append("ReviewContent", data.ReviewContent);

    data.Images?.forEach(file => {
        if (file.originFileObj) {
            formData.append("Files", file.originFileObj);
        }
    });

    if (data.Tags?.length > 0) {
        data.Tags.forEach(tagId => {
            formData.append("VibesIds", tagId);
        });
    }

    return formData;
};