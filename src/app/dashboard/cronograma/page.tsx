"use client";

import { Fragment, useState } from "react";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const horarios = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:30", "14:30", "15:30", "16:30", "17:30",
];

export default function Cronograma() {
  const listlABS = [
    { id: 1, title: 'Lab01' },
    { id: 2, title: 'Lab02' },
    { id: 3, title: 'Lab03' },
  ];

  const [activeId, setActiveId] = useState(1);

  const [tabelas, setTabelas] = useState<{ [id: number]: string[][] }>(() => {
    const init: { [id: number]: string[][] } = {};
    listlABS.forEach(lab => {
      init[lab.id] = horarios.map(() => dias.map(() => ""));
    });
    return init;
  });

  const [editando, setEditando] = useState<{ linha: number; coluna: number } | null>(null);
  const [valorTemp, setValorTemp] = useState("");

  const tabelaAtiva = tabelas[activeId];

  const handleClickCelula = (linha: number, coluna: number) => {
    setEditando({ linha, coluna });
    setValorTemp(tabelaAtiva[linha][coluna]);
  };

  const salvarEdicao = () => {
    if (editando) {
      const novaTabela = [...tabelaAtiva];
      novaTabela[editando.linha][editando.coluna] = valorTemp;
      setTabelas(prev => ({
        ...prev,
        [activeId]: novaTabela
      }));
      setEditando(null);
    }
  };

  const cancelarEdicao = () => {
    setEditando(null);
  };

  const salvarTabela = () => {
    console.log("Cronograma salvo:", tabelaAtiva);
    alert(`Cronograma do ${listlABS.find(lab => lab.id === activeId)?.title} salvo com sucesso!`);
  };

  const isTabelaVazia = tabelaAtiva.every(linha => linha.every(celula => celula === ""));

  return (
    <div className="w-full h-full flex flex-col justify-between p-4">
      <div className="w-full flex items-center justify-center gap-2 mb-4">
        {listlABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`${
              item.id === activeId ? 'bg-theme-lightBlue' : 'bg-theme-blue'
            } h-12 px-4 rounded-[10px] text-theme-white font-semibold`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        📅 Cronograma de aulas - {listlABS.find(lab => lab.id === activeId)?.title}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-theme-blue">
            <tr>
              <th className="border border-gray-400 text-theme-white px-2 py-1 w-[90px] text-center">
                Horário
              </th>
              {dias.map((dia, i) => (
                <th
                  key={i}
                  className="border text-theme-white border-gray-400 px-2 py-1 w-[120px] text-center"
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((hora, linha) => {
              if (hora === "13:30") {
                return (
                  <Fragment key={linha}>
                    <tr>
                      <td colSpan={dias.length + 1} className="bg-yellow-300 text-center font-bold border border-gray-400 py-2">
                        Intervalo
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 font-bold bg-theme-blue text-theme-white text-center w-[90px]">
                        {hora}
                      </td>
                      {dias.map((_, coluna) => (
                        editando?.linha === linha && editando?.coluna === coluna ? (
                          <td key={coluna} className="border border-gray-400 p-0 cursor-pointer w-[120px]">
                            <div className="flex flex-col p-1">
                              <textarea
                                value={valorTemp}
                                onChange={(e) => setValorTemp(e.target.value)}
                                className="w-full font-normal leading-4 bg-transparent h-[50px] p-1 text-center resize-none focus:outline-none"
                              />
                              <div className="flex justify-center gap-2 mt-1">
                                <button onClick={salvarEdicao} className="bg-theme-green font-normal text-white px-2 rounded">OK</button>
                                <button onClick={cancelarEdicao} className="bg-theme-red font-normal text-white px-2 rounded">Cancelar</button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td
                            key={coluna}
                            className="hover:bg-theme-lightBlue hover:text-theme-white border border-gray-400 p-0 cursor-pointer w-[120px]"
                            onClick={() => handleClickCelula(linha, coluna)}
                          >
                            <div className="h-full text-center leading-4 w-full flex items-center justify-center font-normal p-1">
                              {tabelaAtiva[linha][coluna] || "Aula"}
                            </div>
                          </td>
                        )
                      ))}
                    </tr>
                  </Fragment>
                );
              }

              return (
                <tr key={linha}>
                  <td className="border border-gray-400 px-2 py-1 font-bold bg-theme-blue text-theme-white text-center w-[90px]">
                    {hora}
                  </td>
                  {dias.map((_, coluna) => (
                    editando?.linha === linha && editando?.coluna === coluna ? (
                      <td key={coluna} className="border border-gray-400 p-0 cursor-pointer w-[120px]">
                        <div className="flex flex-col p-1">
                          <textarea
                            value={valorTemp}
                            onChange={(e) => setValorTemp(e.target.value)}
                            className="w-full font-normal leading-4 h-[50px] p-1 text-center bg-transparent resize-none focus:outline-none"
                          />
                          <div className="flex justify-center gap-2 mt-1">
                            <button onClick={salvarEdicao} className="bg-theme-green font-normal text-white px-2 rounded">OK</button>
                            <button onClick={cancelarEdicao} className="bg-theme-red font-normal text-white px-2 rounded">Cancelar</button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td
                        key={coluna}
                        className="hover:bg-theme-lightBlue hover:text-theme-white border border-gray-400 p-0 cursor-pointer w-[120px]"
                        onClick={() => handleClickCelula(linha, coluna)}
                      >
                        <div className="h-full w-full text-center leading-4 flex items-center justify-center font-normal p-1">
                          {tabelaAtiva[linha][coluna] || "Aula"}
                        </div>
                      </td>
                    )
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="w-full flex items-center justify-end mt-4">
        <button
          type="button"
          onClick={salvarTabela}
          disabled={isTabelaVazia}
          className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px]
            ${isTabelaVazia ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
