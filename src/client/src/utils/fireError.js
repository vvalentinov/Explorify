import Swal from 'sweetalert2';

export const fireError = (errors) => {
    console.log(errors);

    let html = '';

    if (errors?.length > 0) { html = errors.join('<br>') }

    Swal.fire({
        timer: 8000,
        icon: "error",
        html: html,
        title: "Oops...",
        position: 'top-end',
        customClass: {
            popup: 'sweetAlertPopup',
            confirmButton: 'sweetAlertConfirmBtn',
            htmlContainer: 'sweetAlertHtmlContainer'
        },
    });
};