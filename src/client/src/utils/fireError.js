import Swal from 'sweetalert2';

export const fireError = (errors) => {
    let html = '';

    if (Array.isArray(errors)) {
        html = errors.join('<br>');
    } else if (typeof errors === 'string') {
        html = errors;
    } else {
        html = 'An unknown error occurred.';
    }

    Swal.fire({
        timer: 8000,
        icon: 'error',
        html,
        title: 'Oops...',
        position: 'top-end',
        customClass: {
            popup: 'sweetAlertPopup',
            confirmButton: 'sweetAlertConfirmBtn',
            htmlContainer: 'sweetAlertHtmlContainer'
        },
        showConfirmButton: true,
    });
};
