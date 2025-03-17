import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import Formulario from './components/Formulario';
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";

function App() {

  const [modalAddVisitaPendente, setModalAddVisitaPendente] = useState(false);
  const [visitas, setVisitas] = useState<Visita[]>([])

  type Visita = {
    id: number
    data: string
    status: 'pendente' | 'concluída'
    formularios: number
    produtos: number
    cep: string
    uf: string
    cidade: string
    bairro: string
    logradouro: string
    numero: number
  }

  return (
    <>

      <Container>

        <Cabecalho>
          <Button onClick={() => setModalAddVisitaPendente(true)}> Adicionar Visita</Button>
        </Cabecalho>
        <ListaVisitas>

        </ListaVisitas>
        {modalAddVisitaPendente &&
          <FundoModal>
            <Modal>
              <HeadModal onClick={() => setModalAddVisitaPendente(false)}><ArrowLeft /> Voltar</HeadModal>
              <Formulario />
            </Modal>
          </FundoModal>}
        <Toast
          position="top-right"
          autoClose={50000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
      </Container>

    </>
  );

}

const ListaVisitas = styled.div``
const Container = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
`
const Cabecalho = styled.header``
const Button = styled.button``
const Toast = styled(ToastContainer)`
  top: 2;
  left: 2;
  width: 100%;
  height: 100%;
  position: relative;
  
`

const ArrowLeft = styled(IconArrowLeft)`
  width: 2rem;
  height: 2rem;
`
const HeadModal = styled.div`
  position: sticky;
  top: 0;
  background-color: #f3f4f6;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  cursor: pointer;
`
const FundoModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  overflow-y: hidden;
  `

const Modal = styled.div`
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 0.5rem;
  `

export default App;
