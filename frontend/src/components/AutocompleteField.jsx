import { useState, useEffect, useRef } from "react";

export default function AutocompleteField({
  label,
  value,
  onSelect,
  data = [],
  placeholder = ""
}) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setQuery(value); // mantém o valor selecionado
  }, [value]);

 const handleInput = (text) => {
  setQuery(text);

  if (text.trim() === "") {
    onSelect("");             // <<< AQUI
    setFiltered(data);
    setOpen(true);
    return;
  }

  setFiltered(
    data.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    )
  );
  setOpen(true);
};

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <label className="form-label">{label}</label>

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => {
          setFiltered(data);
          setOpen(true);
        }}
        className="form-input-min"
      />

      {open && filtered.length > 0 && (
        <ul className="absolute w-full bg-white border rounded shadow z-50 max-h-60 overflow-y-auto">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
