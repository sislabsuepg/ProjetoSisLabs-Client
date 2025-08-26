'use client'

import { useState, ChangeEvent } from "react"

export default function Advertencia() {
    const [form, setForm] = useState({
        id: -1,
        nome: '',
        ra: '',
        laboratorio: '',
        motivo: ""
    })
    const [outroMotivo, setOutroMotivo] = useState(false)

    const listaTeste = [
        {
            id: 1,
            nome: "Teste 1",
            ra: '123456',
            laboratorio: "Lab A"
        },
        {
            id: 2,
            nome: "Teste 2",
            ra: '654321',
            laboratorio: "Lab B"
        },
        {
            id: 3,
            nome: "Teste 3",
            ra: '789012',
            laboratorio: "Lab C"
        }
    ]

    const listaEmails = [
        {
            ra: '123456',
            email: 'teste1@example.com'
        },
        {
            ra: '654321',
            email: 'teste2@example.com'
        },
        {
            ra: '789012',
            email: 'teste3@example.com'
        }
    ]

    const handleEmprestimoChange = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        const { value } = e.target;
        const selectedEmprestimo = listaTeste.find((item) => item.ra === value);
        if (selectedEmprestimo) {
            setForm((f) => ({ ...f, ...selectedEmprestimo }));
        }
    }

    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === "outro"){
            setOutroMotivo(true);
            setForm((f) => ({ ...f, motivo: "" }));
        } else {
            setOutroMotivo(false);
            setForm((f) => ({ ...f, motivo: value }));
        }

    }

    return (
        <div className="mt-5 w-full">
            <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
            Emitir Advertência
            </p>
            <div className="w-full h-full flex flex-col justify-between">
                <form
                // onSubmit={}
                className="mt-4 space-y-4 w-full"
                >
                    <div className="w-full flex items-center gap-4">
                        <select value={form.ra} name="ra" onChange={handleEmprestimoChange}>
                            {listaTeste.map((item) => (
                                <option key={item.id} value={item.ra}>
                                    {item.ra}
                                </option>
                            ))}
                        </select>
                        <p>{'Empréstimo Selecionado:'}</p>
                        <p>{'RA: ' + form.ra}</p>
                        <p>{'Nome: ' + form.nome}</p>
                        <p>{'Laboratório: ' + form.laboratorio}</p>
                    </div>
                    <div className="w-full flex items-center gap-4">
                        <label htmlFor="naoDevolucaoChave">Não devolução da chave</label>
                        <input
                            type="radio"
                            id="naoDevolucaoChave"
                            name="motivo"
                            value={"Não devolução da chave"}
                            onChange={handleRadioChange}
                            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                        />
                        <label htmlFor="naoApresentouSaida">Não apresentou a saída</label>
                        <input
                            type="radio"
                            id="naoApresentouSaida"
                            name="motivo"
                            value={"Não apresentou a saída"}
                            onChange={handleRadioChange}
                            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                        />
                        <label htmlFor="outro">Outro</label>
                        <input
                            type="radio"
                            id="outro"
                            name="motivo"
                            value={"outro"}
                            onChange={handleRadioChange}
                            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                        />
                    </div>
                    {
                        outroMotivo === true && (
                            <div>
                                <label htmlFor="outroMotivo">Especifique o motivo:</label>
                                <input
                                    type="text"
                                    id="outroMotivo"
                                    value={form.motivo}
                                    onChange={(e) => setForm(f => ({...f, outroMotivo: e.target.value}))}
                                    className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                                />
                            </div>
                    )}
                    <div>
                        <p>{'Motivo: ' + form.motivo}</p>
                        <p>{'Email: ' + (listaEmails.find(e => e.ra === form.ra)?.email ?? '')}</p>
                    </div>
                    <button className="bg-theme-red text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]">Emitir Advertência</button>
                </form>
            </div>
        </div>
    )


}