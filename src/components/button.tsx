export default function Button({ children }: ButtonProps) {
    return (
        <button className="bg-neutral-700 hover:bg-indigo-600 duration-150 hover:text-white transition-colors px-3.5 py-2 rounded active:bg-indigo-800">
            {children}
        </button>
    )
}

interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {}
