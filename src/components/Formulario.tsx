import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Bounce, Slide, ToastContainer, toast } from "react-toastify"
import axios from 'axios'
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

type FormularioProps = {
  receberVisitas: (Visitas: Visita[]) => void;
  editarVisita: Visita | null;
  enviarVisitas: Visita[] | null;
}

export default function Formulario({ enviarVisitas, editarVisita, receberVisitas }: FormularioProps) {

  const cookies = new Cookies();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [disabledEndereco, setDisabledEndereco] = useState({
    logradouro: false,
    bairro: false,
    cidade: false,
    uf: false,
    numero: false,
  } as any);
  const [visitas, setVisitas] = useState<Visita[]>(enviarVisitas ?? []);

  const { register, handleSubmit, setValue, reset } = useForm<Visita>({
    defaultValues: editarVisita ?? {}
  })

  const visitasPorData = visitas.reduce((acc, visita) => {
    if (!acc[visita.data]) {
      acc[visita.data] = [];
    }
    acc[visita.data].push(visita);
    return acc;
  }, {} as Record<string, Visita[]>);

  const resetForm = () => {
    reset({
      formularios: 0,
      produtos: 0,
      data: '',
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      logradouro: '',
      numero: undefined,
    });
  };

  const handleCep = (e: any) => {
    setDisabledEndereco({
      logradouro: true,
      bairro: true,
      cidade: true,
      uf: true,
      numero: true,
    });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      axios
        .get(`https://viacep.com.br/ws/${e.target.value.replace(/\D/g, '')}/json/`)
        .then((r: any) => {

          setValue('uf', r.data.uf || '')
          setValue('cidade', r.data.localidade || '')
          setValue('bairro', r.data.bairro || '')
          setValue('logradouro', r.data.logradouro || '')
          setValue('numero', r.data.numero || '')

          if (r.data.bairro === '' && r.data.logradouro === '') {
            setDisabledEndereco({
              logradouro: true,
              bairro: false,
              cidade: false,
              uf: true,
              numero: false,
            });
          }
          else {
            setDisabledEndereco({
              logradouro: false,
              bairro: false,
              cidade: false,
              uf: false,
              numero: false,
            });
          }
        })
        .catch(() => {

          setDisabledEndereco({
            logradouro: true,
            bairro: true,
            cidade: true,
            uf: true,
            numero: false,
          })

          toast.error('Houve algum problema ao buscar o cep', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light'
          })
        })
    }, 1000)

  }

  const calcularDuracao = (form: number, produtos: number) => {
    return (15 * form) + (5 * produtos)
  }

  useEffect(() => {
    if (editarVisita?.id === undefined) {
      resetForm();
    }
  }, []);

  useEffect(() => {
    receberVisitas(visitas);
    cookies.set('visitas', visitas);
  }, [visitas]);

  function onSubmit(data: Visita) {


    let invalidVisita = false;

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
      invalidVisita = true;
    }

    if (!data.formularios || data.formularios < 1) {
      toast.error('O número de formulários é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }
    if (!data.produtos || data.produtos < 1) {
      toast.error('A quantidade de produtos é obrigatória.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (visitasPorData[data.data] !== undefined) {

      var totalFormularios = visitasPorData[data.data].reduce(
        (total, visita) => total + (editarVisita?.id === visita.id ? 0 : Number(visita.formularios)), 0
      );

      var totalProdutos = visitasPorData[data.data].reduce(
        (total, visita) => total + (editarVisita?.id === visita.id ? 0 : Number(visita.produtos)), 0
      );

      totalFormularios += Number(data.formularios);
      totalProdutos += Number(data.produtos);

      if (editarVisita?.id === undefined) {
        if (calcularDuracao(Number(totalFormularios) + Number(data.formularios), Number(totalProdutos) + Number(data.produtos)) > 480) {
          toast.error('As visitas do dia não podem ultrapassar o limite máximo de 8 horas...', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light'
          })
          invalidVisita = true;
        }

      }
    }



    if (!data.cep) {
      toast.error('O CEP é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (!data.cidade) {
      toast.error('A cidade é obrigatória.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (!data.uf || data.uf.length !== 2) {
      toast.error('A UF é obrigatória e deve conter 2 caracteres.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
    }

    if (!data.logradouro) {
      toast.error('O logradouro é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (!data.bairro) {
      toast.error('O bairro é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (!data.numero) {
      toast.error('O numero é obrigatório.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }
    if (calcularDuracao(data.formularios, data.produtos) > 480) {
      toast.error('A visita não pode ultrapassar o limite máximo de 8 horas por dia.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light'
      })
      invalidVisita = true;
    }

    if (invalidVisita) {
      return
    }
    else {
      if (editarVisita?.id === undefined) {
        const novoId = Date.now();
        const novaVisita = { ...data, id: novoId, status: "pendente" };

        setVisitas((prevVisitas: any) => {
          const visitasAtualizadas = [...prevVisitas, novaVisita];
          return visitasAtualizadas;
        });
        toast.success('A visita foi adicionada com sucesso.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light'
        })
        resetForm();
      } else {
        setVisitas(prevVisitas => {
          const listaAtualizada = prevVisitas.map((v) =>
            v.id === editarVisita.id ? { ...v, ...data, id: editarVisita.id } : v
          );
          console.log(listaAtualizada);
          return listaAtualizada;
        });
        toast.success('A visita foi editada com sucesso.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light'
        })
        resetForm();
      }
    }


    console.log('Dados:', data, " editar: ",)
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
        <Input {...register('cep')} onChange={(e) => {
          let value = e.target.value.replace(/\D/g, ''); 
          if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2'); 
          }
          setValue('cep', value);
          setValue('uf', '')
          setValue('cidade', '')
          setValue('bairro', '')
          setValue('logradouro', '')

          handleCep(e)
        }
        } maxLength={9} type="text" />

        <LabelText>Cidade</LabelText>
        <Input {...register('cidade')} readOnly disabled={disabledEndereco['cidade']} type="text" />

        <LabelText>UF</LabelText>
        <Input {...register('uf')} readOnly disabled={disabledEndereco['uf']} type="text" />

        <LabelText>Logradouro</LabelText>
        <Input {...register('logradouro')} disabled={disabledEndereco['logradouro']} type="text" />

        <LabelText>Bairro</LabelText>
        <Input {...register('bairro')} disabled={disabledEndereco['bairro']} type="text" />

        <LabelText>Número</LabelText>
        <Input {...register('numero')} disabled={disabledEndereco['numero']} type="number" />

        <Button type="submit">{(editarVisita?.id === undefined) ? 'ADICIONAR VISITA' : 'EDITAR VISITA'}</Button>
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
