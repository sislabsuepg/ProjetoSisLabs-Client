'use client'

import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from "@mui/material"
import { useState, ChangeEvent } from "react"

interface FormState {
    id: number | null
    nome: string
    ra: string
    laboratorio: string
    motivo: string
    motivoEspecifico: string
}

export default function Advertencia() {
    const [form, setForm] = useState<FormState>({
        id: null,
        nome: '',
        ra: '',
        laboratorio: '',
        motivo: '',
        motivoEspecifico: ''
    })
    const [outroMotivo, setOutroMotivo] = useState(false)

    const listaRA = [
        { id: 1, nome: "Teste 1", ra: '123456' },
        { id: 2, nome: "Teste 2", ra: '654321' },
        { id: 3, nome: "Teste 3", ra: '789012' },
    ]

    const listaLab = [
        { id: 1, lab: "Lab A" },
        { id: 2, lab: "Lab B" },
        { id: 3, lab: "Lab C" },
    ]

    const listaEmails = [
        { ra: '123456', email: 'teste1@example.com' },
        { ra: '654321', email: 'teste2@example.com' },
        { ra: '789012', email: 'teste3@example.com' }
    ]

    const handleRAChange = (e: SelectChangeEvent<string>) => {
        const raSelecionado = e.target.value
        const aluno = listaRA.find(a => a.ra === raSelecionado)
        setForm(f => ({
            ...f,
            ra: raSelecionado,
            nome: aluno ? aluno.nome : ''
        }))
    }

    const handleLaboratorioChange = (e: SelectChangeEvent<string>) => {
        setForm(f => ({ ...f, laboratorio: e.target.value }))
    }

    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === "outro") {
            setOutroMotivo(true)
            setForm(f => ({ ...f, motivo: "outro" }))
        } else {
            setOutroMotivo(false)
            setForm(f => ({ ...f, motivo: value, motivoEspecifico: "" })) // limpa motivoEspecifico
        }
    }

    const handleOutroMotivoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, motivoEspecifico: e.target.value }))
    }

    const isFormValid =
        form.ra !== '' &&
        form.laboratorio !== '' &&
        form.motivo !== '' &&
        (form.motivo !== 'outro' || form.motivoEspecifico.trim() !== '')

    return (
        <div className="w-full flex flex-col h-full items-start">
            <p className="text-theme-blue font-semibold text-[1.2rem] w-full text-start">
                Laboratórios em uso
            </p>

            <p className="text-[0.9rem] italic font-medium mb-10 text-theme-red">
                Observação: a advertência é recorrente ao dia atual do empréstimo.
            </p>

            <div className="w-full h-full flex flex-col justify-between">
                <form className="mt-4 space-y-4 w-full h-full flex flex-col justify-between">
                    <div className="flex flex-col space-y-4 w-full">
                        <div className="w-full flex items-center gap-4">
                            <FormControl className="w-full font-normal p-3 text-[0.9rem] rounded-md" variant="filled">
                                <InputLabel>RA do acadêmico</InputLabel>
                                <Select name="ra" value={form.ra} onChange={handleRAChange}>
                                    <MenuItem value="">-- Selecione uma opção --</MenuItem>
                                    {listaRA.map(el => (
                                        <MenuItem key={el.id} value={el.ra}>{el.ra}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl className="w-full font-normal p-3 text-[0.9rem] rounded-md" variant="filled">
                                <InputLabel>Laboratório usado</InputLabel>
                                <Select name="laboratorio" value={form.laboratorio} onChange={handleLaboratorioChange}>
                                    <MenuItem value="">-- Selecione uma opção --</MenuItem>
                                    {listaLab.map(el => (
                                        <MenuItem key={el.id} value={el.lab}>{el.lab}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="w-full bg-theme-container py-3 px-5 rounded-[10px] relative">
                                <p className="font-semibold text-theme-blue mb-2">Motivo da advertência</p>
                                <FormControl className="w-full">
                                    <RadioGroup value={form.motivo} onChange={handleRadioChange}>
                                        <FormControlLabel value="naoDevolucaoChave" control={<Radio />} label="Não devolução da chave" />
                                        <FormControlLabel value="naoApresentouSaida" control={<Radio />} label="Não apresentou a saída" />
                                        <FormControlLabel value="outro" control={<Radio />} label="Outro" />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            {outroMotivo && (
                                <div className="w-full flex flex-col">
                                    {outroMotivo && (
                                        <TextField
                                            label="Especifique o motivo"
                                            variant="filled"
                                            value={form.motivoEspecifico}
                                            onChange={handleOutroMotivoChange}
                                            className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {form?.ra && <p className="font-normal">
                            {'Email: ' + (listaEmails.find(e => e.ra === form.ra)?.email ?? '')}
                        </p>}
                    </div>

                    <div className="w-full flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[170px] text-white rounded-[10px] 
                             ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Emitir advertência
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
