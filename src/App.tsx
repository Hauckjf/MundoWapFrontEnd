import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import Formulario from './components/Formulario';
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";

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

function App() {

  const [modalAddVisitaPendente, setModalAddVisitaPendente] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState({} as Visita | null);
  const [visitas, setVisitas] = useState<Visita[]>([])
  const visitasPorData = visitas.reduce((acc, visita) => {
    if (!acc[visita.data]) {
      acc[visita.data] = [];
    }
    acc[visita.data].push(visita);
    return acc;
  }, {} as Record<string, Visita[]>);

  const handleVisitas = (e: any) => {
    setVisitas(e);
  }

  return (
    <>

      <Container>
        <Cabecalho>
          <Title>Bem vindo - Sistema de gerenciamento de visitas</Title>
          <Button onClick={() => setModalAddVisitaPendente(true)}> Adicionar Visita</Button>
        </Cabecalho>
        <ListaVisitas>
          {Object.keys(visitasPorData).map((data) => (
            <DataGroup key={data}>
              <DataTitle>{data}</DataTitle>
              <GridContainer>
                {visitasPorData[data].map((visita) => (
                  <Card key={visita.id}>
                    <Info>
                      <Label>Status:</Label>
                      <Status status={visita.status}>{visita.status}</Status>

                      <Label>Endereço:</Label>
                      <Content>
                        {visita.logradouro}, {visita.numero} - {visita.bairro}, {visita.cidade}/{visita.uf}
                      </Content>

                      <Label>Formulários e Produtos:</Label>
                      <Content>
                        {visita.formularios} formulários, {visita.produtos} produtos
                      </Content>
                    </Info>

                    <EditButton onClick={() => { setSelectedVisita(visita); setModalAddVisitaPendente(true); }}>Editar</EditButton>
                  </Card>
                ))}
              </GridContainer>
            </DataGroup>
          ))}
        </ListaVisitas>
        {modalAddVisitaPendente &&
          <FundoModal>
            <Modal>
              <HeadModal onClick={() => { setModalAddVisitaPendente(false); }}><ArrowLeft /> Voltar</HeadModal>
              <Formulario receberVisitas={handleVisitas} editarVisita={selectedVisita ?? null} enviarVisitas={visitas} />
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

const Title = styled.h1`
  margin-right: 10px;
  margin-left: 10px;
  text-align: center;
`

const DataGroup = styled.div`
  margin-bottom: 2rem;
`;

const DataTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
`;

const ListaVisitas = styled.div`
  margin:10px;
`

const Container = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
`
const Cabecalho = styled.header`
  width: 100%;
  background-color: #f3f4f6;
`
const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  margin-left: 10px;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }`
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const Content = styled.span`
  font-size: 1rem;
  color: #111827;
`;

const Status = styled(Content) <{ status: 'pendente' | 'concluída' }>`
  color: ${({ status }) => (status === 'pendente' ? '#d97706' : '#059669')};
`;

const EditButton = styled.button`
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

export default App;
