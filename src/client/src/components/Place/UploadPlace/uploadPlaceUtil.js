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

    console.log(data.CategoryId);

    const formData = new FormData();

    formData.append("Name", data.Name ?? "");
    formData.append("Address", data.Address ?? "");
    formData.append("Description", data.Description ?? "");

    if (data.CategoryId) {
        formData.append("CategoryId", data.CategoryId[0]);
        formData.append("SubcategoryId", data.CategoryId[1]);
    } else {
        formData.append("CategoryId", 0);
        formData.append("SubcategoryId", 0);
    }

    if (data.CountryId) {
        formData.append("CountryId", data.CountryId);
    } else {
        formData.append("CountryId", 0);
    }

    formData.append("ReviewRating", data.Rating ?? 0);
    formData.append("ReviewContent", data.ReviewContent ?? "");

    if (data.Latitude) {
        formData.append("Latitude", data.Latitude);
    }
    if (data.Longitude) {
        formData.append("Longitude", data.Longitude);
    }

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