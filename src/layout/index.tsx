import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Modal from "../components/Modal";
import { useAppStore } from "../stores/useAppStore";

export default function IndexLayout() {

    const modal = useAppStore((state) => state.modal)
    const selectProducto = useAppStore((state) => state.selectProducto)

    return (
        <div className="bg-[#24262A] bg-cover h-full bg-no-repeat main-layout overflow-x-hidden">
            <Header/>
            <Outlet/>
            <Footer/>
            {
                modal && selectProducto && <Modal/>
            }
        </div>
    )
}