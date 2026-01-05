//dependeincias
import { BrowserRouter, Routes, Route } from "react-router-dom"

//paginas
import Index from "./pages"

//Layout
import IndexLayout from "./layout"
import Nosotros from "./pages/nosotros"
import ServiciosPage from "./pages/serviciosPage"
import Postular from "./pages/postular"
import Contactos from "./pages/contactos"
import Catalogo from "./pages/catalogo"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={< IndexLayout/>}>
          //index de la web
          <Route path='/' element={
              <Index/>
          } index />

          //nosotros
          <Route path='/nosotros' element={
            <Nosotros/>
          }/>

          //servicios
          <Route path='/servicios' element={
            <ServiciosPage />
          }/>

          //contactos
          <Route path='/contactos' element={
            <Contactos/>
          }/>

          //postular
          <Route path='/postular' element={
            <Postular/>
          }/>

          //catalogo
          <Route path='/catalogo' element={
            <Catalogo/>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

