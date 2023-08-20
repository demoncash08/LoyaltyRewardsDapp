import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ConfirmTransaction(props) {
  toast.success(`Success! Here is your transaction:${props.transactionHash} `, {
    position: "top-right",
    autoClose: 18000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}
return ConfirmTransaction;
