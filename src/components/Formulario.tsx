import { IconArrowLeft } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

export default function Formulario() {

  type Visita = {
    id: number
    data: string
    status: 'pendente' | 'concluída'
    formularios: number
    produtos: number
    cep: string
    uf: string
    cidade: string
    logradouro: string
    bairro: string
    numero: number
  }

  return (
   <>
   <Container>
   <Form>
    <LabelText>Data da Visita</LabelText>
    <Input type="date" />
    <LabelText>Quantidade de formulários</LabelText>
    <Input type="number" />
    <LabelText>Quantidade de produtos</LabelText>
    <Input type="number" />
    <LabelText>CEP</LabelText>
    <Input type="text" />
    <LabelText>Cidade</LabelText>
    <Input type="text" />
    <LabelText>UF</LabelText>
    <Input type="text" />
    <LabelText>Logradouro</LabelText>
    <Input type="text" />
    <LabelText>Bairro</LabelText>
    <Input type="text" />
    <LabelText>Número</LabelText>
    <Input type="number" />
    <Button onClick={() => console.log('salvar')}> ADICIONAR VISITA</Button>
   </Form>
   </Container>
   </>
  );

}

const Button = styled.button`
  margin-top: 0.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  &:hover {
    background-color: #2563eb;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`
const Container = styled.div`
  width: 34rem;
`
const LabelText = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`

const Input = styled.input`
  width: 100%;
  height: 30px;
  font-size : large;
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`
const Form = styled.form`
  display: flex;
  margin: 20px;
  flex-direction: column;
`