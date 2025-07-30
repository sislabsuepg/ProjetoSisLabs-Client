interface IProps {
  text: string;
  disabled: boolean;
}

export default function DefaultButton({ text, disabled = false }: IProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`disabled:bg-gray-400 bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-theme-white rounded-[10px]`}
    >
      {text}
    </button>
  );
}
