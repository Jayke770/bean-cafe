import SweetAlert from 'sweetalert2'
import withReactContent from "sweetalert2-react-content"
const Swal = withReactContent(SweetAlert.mixin({
    position: 'bottom',
    customClass: {
        container: "k-color-brand-primary"
    },
    confirmButtonColor: "#cc9c68",
    showClass: {
        backdrop: 'bg-black/80',
        popup: 'animate__animated animate__fadeInUp ms-300'
    },
    hideClass: {
        backdrop: 'bg-black/80',
        popup: 'animate__animated animate__fadeOutDown ms-300'
    },
    backdrop: true,
    allowOutsideClick: false
}))
export default Swal