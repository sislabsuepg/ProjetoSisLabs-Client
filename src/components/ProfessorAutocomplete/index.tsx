"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { IProfessor } from "@/interfaces/interfaces";

interface ProfessorAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  professores: IProfessor[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  width?: string;
}

export default function ProfessorAutocomplete({
  value,
  onChange,
  professores,
  placeholder = "-",
  disabled = false,
  className,
  width = "w-full",
}: ProfessorAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // determina direção de abertura
  const [query, setQuery] = useState(value || "");
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const normalizar = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const listaFiltrada = professores
    .filter((p) => normalizar(p.nome).includes(normalizar(query)))
    .slice(0, 40);

  const aplicarValor = useCallback(
    (nome: string) => {
      onChange(nome);
      setQuery(nome);
      setOpen(false);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && ["ArrowDown", "Enter"].includes(e.key)) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, listaFiltrada.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && listaFiltrada[highlight]) {
        e.preventDefault();
        aplicarValor(listaFiltrada[highlight].nome);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector<HTMLLIElement>(
        `[data-index='${highlight}']`
      );
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlight, open]);

  // Decide direção quando abrir
  useEffect(() => {
    if (open) {
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const espaçoAbaixo = viewportHeight - rect.bottom;
        const estimatedDropdownHeight =
          Math.min(listaFiltrada.length, 5) * 36 + 16; // item ~36px + padding
        setOpenUp(
          espaçoAbaixo < estimatedDropdownHeight &&
            rect.top > estimatedDropdownHeight
        );
      }
    }
  }, [open, listaFiltrada.length]);

  return (
    <div ref={containerRef} className={clsx("relative", width)}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "h-[50px] rounded-none text-center bg-transparent focus:bg-theme-lightBlue/20 focus:outline-none text-sm border-none w-full",
          className
        )}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="lista-professores-opcoes"
      />
      {open && listaFiltrada.length > 0 && (
        <ul
          id="lista-professores-opcoes"
          ref={listRef}
          role="listbox"
          className={clsx(
            "absolute z-20 w-full bg-white shadow-lg border border-theme-blue/30 rounded-md text-left p-1 scroll-py-1 overflow-auto",
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          )}
          style={{ maxHeight: `${5 * 36 + 16}px` }} // 5 itens máx + padding
        >
          {listaFiltrada.map((p, idx) => {
            const ativo = idx === highlight;
            return (
              <li
                key={p.id}
                data-index={idx}
                role="option"
                aria-selected={ativo}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  aplicarValor(p.nome);
                }}
                className={clsx(
                  "px-2 py-1 cursor-pointer rounded text-sm flex items-center gap-2",
                  ativo
                    ? "bg-theme-lightBlue text-white"
                    : "hover:bg-theme-lightBlue/30 text-theme-blue"
                )}
              >
                <span className="truncate font-bold">{p.nome}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
