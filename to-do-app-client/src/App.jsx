import { useEffect, useState } from 'react'
import ListHeader from './components/ListHeader'
import './CSS/normalize.css'
import './CSS/App.css'

function App() {

  const getToDosData = async() => {
    try {
      const url = `http://localhost:8000/todos` //SELECCIONAMOS CLIENTE POR SU "id"
        const respuesta = await fetch(url) //NO PONEMOS EL MÉTODO PORQUE "fetch" POR DEFECTO YA TRAE EL MÉTODO "GET"
        const resultado = await respuesta.json() //CREAMOS UN "JSON" QUE CONTENGA LOS DATOS DEL CLIENTE SELECCIONADO

        console.log(resultado)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getToDosData()
  }, [])
  

  return (
    <div className="principal-app-container">
      <ListHeader/>
    </div>
  )
}

export default App
