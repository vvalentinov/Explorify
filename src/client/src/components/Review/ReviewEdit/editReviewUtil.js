export const generateFormData = (data, toBeRemovedImagesIds) => {

    const formData = new FormData();

    formData.append("Rating", data.Rating);
    formData.append("Content", data.Content);

    toBeRemovedImagesIds.forEach(id => formData.append('ToBeRemovedImagesIds', id));

    data.Images?.forEach(file => {
        if (file.originFileObj) {
            formData.append("NewImages", file.originFileObj);
        }
    });

    return formData;
};