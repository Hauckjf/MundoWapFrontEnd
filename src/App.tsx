import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import Formulario from './components/Formulario';

function App() {

  const [modalAddVisitaPendente, setModalAddVisitaPendente] = useState(false);
  
  type FormInputs = {
    data: string
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

    {modalAddVisitaPendente &&
   <FundoModal>
    <Modal>
      <HeadModal onClick={() => setModalAddVisitaPendente(false)}><ArrowLeft /> Voltar</HeadModal>
      <Formulario />
    </Modal>
   </FundoModal>}
   </Container>
   </>
  );

}

const Container = styled.div``
const Cabecalho = styled.header``
const Button = styled.button``
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
  overflow-y: auto;`
  
const Modal = styled.div`
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 0.5rem;
  `
export default App;
