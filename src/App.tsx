import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import Formulario from './components/Formulario';
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import { parseISO, format, addDays } from 'date-fns';
import Cookies from 'universal-cookie';


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

interface BarProgressProps {
  percent: number;
  cor: string;
}

interface BarProgressConcluidoProps {
  percentConcluido: number;
  cor: string;
}

function App() {

  const cookies = new Cookies();
  const [modalVisitaPendente, setModalVisitaPendente] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState({} as Visita | null);
  const [visitas, setVisitas] = useState<Visita[]>(cookies.get('visitas') ?? [])

  const visitasPorData = visitas.reduce((acc, visita) => {
    if (!acc[visita.data]) {
      acc[visita.data] = [];
    }
    acc[visita.data].push(visita);
    return acc;
  }, {} as Record<string, Visita[]>);


  const visitasConcluidasPorData = visitas.reduce((acc, visita) => {
    if (visita.status === 'concluída') {
      if (!acc[visita.data]) {
        acc[visita.data] = [];
      }
      acc[visita.data].push(visita);
    }
    return acc;
  }, {} as Record<string, Visita[]>);

  const handleVisitas = (e: any) => {
    setVisitas(e);
    cookies.set('visitas', e);

    if (e !== visitas) {
      setModalVisitaPendente(false);
    }
  }

  const concluirVisita = (id: number) => {
    setVisitas((prev) =>
      prev.map((visita) =>
        visita.id === id ? { ...visita, status: 'concluída' } : visita
      )
    );
  };

  const calcularDuracao = (form: number, produtos: number) => {
    return (15 * form) + (5 * produtos)
  }

  const calcularPercentualDiario = (visitas: Visita[]) => {
    const totalMinutos = visitas.reduce((total, v) => total + calcularDuracao(v.formularios, v.produtos), 0);
    return (totalMinutos / 480) * 100;
  };

  const fecharDia = (dia: any) => {
    setVisitas((prevVisitas) => {
      let visitasPendentes = visitasPorData[dia]?.filter(v => v.status === 'pendente') || [];
      if (visitasPendentes.length === 0) {
        toast.error('Dia fechado e visitas movidas com sucesso!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light'
        });
        return prevVisitas;
      }

      let novasVisitas = prevVisitas.filter(v => !(v.data === dia && v.status === 'pendente'));
      let proximaData = addDays(parseISO(dia), 1);

      while (visitasPendentes.length > 0) {
        const proximaDataFormatada = format(proximaData, 'yyyy-MM-dd');

        const minutosOcupados = (visitasPorData[proximaDataFormatada] || []).reduce(
          (total, v) => total + calcularDuracao(v.formularios, v.produtos),
          0
        );

        let minutosDisponiveis = 480 - minutosOcupados;

        visitasPendentes = visitasPendentes.filter(visita => {
          const duracaoVisita = calcularDuracao(visita.formularios, visita.produtos);
          if (duracaoVisita <= minutosDisponiveis) {
            novasVisitas.push({ ...visita, data: proximaDataFormatada });
            minutosDisponiveis -= duracaoVisita;
            return false;
          }
          return true;
        });

        if (visitasPendentes.length > 0) proximaData = addDays(proximaData, 1);
      }

      toast.success('Dia fechado e visitas movidas com sucesso!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      });
      return novasVisitas;
    });
  };

  return (
    <>
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
      <Container>
        <Cabecalho>
          <Title>Bem vindo - Sistema de gerenciamento de visitas</Title>
          <Button onClick={() => { setModalVisitaPendente(true); setSelectedVisita(null); }}> Adicionar Visita</Button>
        </Cabecalho>
        <ListaVisitas>
          {Object.keys(visitasPorData).map((dia) => {
            var percent = Number(calcularPercentualDiario(visitasPorData[dia] ?? []).toFixed(2));
            var percentConcluido = visitasConcluidasPorData[dia] ? Number(calcularPercentualDiario(visitasConcluidasPorData[dia] ?? []).toFixed(2)) : 0;
            var dataFormatada = new Date(`${dia}T00:00:00-03:00`)
              .toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });

            dataFormatada = dataFormatada[0].toUpperCase() + dataFormatada.slice(1).replace(',', '');

            let cor = '#2563eb'
            if (percent < 60) cor = '#ff0000'
            if (percent > 90) cor = '#18c900'
            return (
              <DataGroup key={dia}>
                <GridContainer>
                  <DataTitle>
                    {dataFormatada}                
                    <FinishButton onClick={() => fecharDia(dia)}>
                      Fechar dia útil
                    </FinishButton>
                  </DataTitle>
                  <ListaBar>
                    <Label>
                      ({percent}%)
                      Barra de progresso por hora Pendentes
                    </Label>
                    <FundoBarProgress>
                      <BarProgress percent={percent} cor={cor} />
                    </FundoBarProgress>
                    <Label>
                      ({percentConcluido}%)
                      Barra de progresso por hora Concluídos
                    </Label>
                    <FundoBarProgressConcluido>
                      <BarProgressConcluido percentConcluido={percentConcluido} cor={'#1aec4f'} />
                    </FundoBarProgressConcluido>
                  </ListaBar>
                </GridContainer>
                <GridContainer>
                  {visitasPorData[dia].map((visita) => (
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
                      {visita.status === 'pendente' && <>
                        <EditButton onClick={() => { setSelectedVisita(visita); setModalVisitaPendente(true); }}>Editar</EditButton>
                        <FinishButton onClick={() => concluirVisita(visita.id)}>
                          Concluir Visita
                        </FinishButton>
                      </>}
                    </Card>
                  ))}
                </GridContainer>
              </DataGroup>
            )
          })}
        </ListaVisitas>
        {modalVisitaPendente &&
          <FundoModal>
            <Modal>
              <HeadModal onClick={() => { setModalVisitaPendente(false); }}><ArrowLeft /> Voltar</HeadModal>
              <Formulario receberVisitas={handleVisitas} editarVisita={selectedVisita ?? null} enviarVisitas={visitas} />
            </Modal>
          </FundoModal>}

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
  display: block;
  margin-bottom: 2rem;
`;

const DataTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
`;

const BarProgress = styled.div<BarProgressProps>`
  background-color: ${({ cor }) => cor};
  border-radius: 0.5rem;
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  transition: width 0.3s ease;
  display: block;

  
`;

const FundoBarProgress = styled.div`
  background-color: #2cec1a;
  border-radius: 0.5rem;
  height: 20%;
  width: 100%;
`

const BarProgressConcluido = styled.div<BarProgressConcluidoProps>`
  background-color: ${({ cor }) => cor};
  border-radius: 0.5rem;
  height: 100%;
  width: ${({ percentConcluido }) => `${percentConcluido}%`};
  transition: width 0.3s ease;
  display: block;
`;

const FundoBarProgressConcluido = styled.div`
  background-color: #ec1a1a;
  border-radius: 0.5rem;
  height: 20%;
  width: 100%;
  margin-bottom: 30px;
`

const ListaBar = styled.div`
  height: 100%;
  width: 90%;
  margin-bottom: 120px;
  margin: 10px;

  @media (min-width: 340px) {
    height: 100%;
    max-width: 50%;
  }
`

const ListaVisitas = styled.div`
  margin: 10px;
  max-width: 100vw;
  @media (max-width: 368px) {
    max-width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`

const Container = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  align-items: center;
  display: table;
  @media (max-width: 368px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Cabecalho = styled.header`
  width: 100%;
  background-color: #f3f4f6;
`
const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  margin-left: 10px;
  margin-bottom: 10px;
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
  position: fixed;
  
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
  @media (min-width: 640px) {
  width: 70%;
  }
  `

const GridContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: auto;
  overflow-x: auto;
  gap: 1rem;
  max-width: 100vw;
  width: 100%;
  margin: 30px;

  @media (min-width: 640px) {
    width: auto;
  }
`;

const Card = styled.div`
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 230px;
  
  @media (min-width: 340px) {
    width: 300px;
  }
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
  white-space: nowrap;
  padding-right: 100px;

`;

const Content = styled.span`
  font-size: 1rem;
  color: #111827;
`;

const Status = styled(Content) <{ status: 'pendente' | 'concluída' }>`
  color: ${({ status }) => (status === 'pendente' ? '#d97706' : '#059669')};
`;

const EditButton = styled.button`
  margin: 1rem;
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

const FinishButton = styled.button`
  margin: 1rem;
  background-color: #1aec4f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgb(0, 233, 12);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

export default App;
