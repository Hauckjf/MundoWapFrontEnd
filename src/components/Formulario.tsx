import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Bounce, Slide, ToastContainer, toast } from "react-toastify"

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

export default function Formulario() {
  const { register, handleSubmit } = useForm<FormInputs>()

  function onSubmit(data: FormInputs) {
    if (!data.data) {
      toast.error('A data é obrigatória.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }
    if (!data.formularios || data.produtos < 0) {
      toast.error('O número de formulários é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }
    if (!data.produtos || data.produtos < 0) {
      toast.error('A quantidade de produtos é obrigatória.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }

    console.log('Dados:', data)
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <LabelText>Data da Visita</LabelText>
        <Input {...register('data')} type="date" />

        <LabelText>Quantidade de formulários</LabelText>
        <Input {...register('formularios')} type="number" />

        <LabelText>Quantidade de produtos</LabelText>
        <Input {...register('produtos')} type="number" />

        <LabelText>CEP</LabelText>
        <Input {...register('cep')} type="text" />

        <LabelText>Cidade</LabelText>
        <Input {...register('cidade')} type="text" />

        <LabelText>UF</LabelText>
        <Input {...register('uf')} type="text" />

        <LabelText>Logradouro</LabelText>
        <Input {...register('logradouro')} type="text" />

        <LabelText>Bairro</LabelText>
        <Input {...register('bairro')} type="text" />

        <LabelText>Número</LabelText>
        <Input {...register('numero')} type="number" />

        <Button type="submit">ADICIONAR VISITA</Button>
      </Form>
    </Container>
  )
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
